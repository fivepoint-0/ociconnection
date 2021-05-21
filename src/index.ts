import net from 'net'
import crypto from 'crypto'
import { Parser } from 'xml2js'
import { BroadsoftDocument, BroadsoftXMLHelper } from './xml'

export class OCIConnection {
  public log: Array<{ request: string, response: string }> = []
  public sessionId: string
  private host: any
  private port: any
  private parser: Parser
  private client: net.Socket
  private helper: BroadsoftXMLHelper
  private password: any
  private username: any
  private debug: boolean = false
  private signedPassword: any
  private logXml: boolean = false

  constructor(host: string, port: string, username: string, password: string, debug: boolean = false, log: boolean = false) {
    this.host = host
    this.port = port
    this.logXml = log
    this.username = username
    this.password = password
    this.signedPassword = ''
    this.parser = new Parser()
    this.client = new net.Socket()
    this.helper = new BroadsoftXMLHelper()
    this.sessionId = Math.floor(Math.random() * 100000000000000).toString()
    this.setDebug(debug)
    this.helper.setSessionId(this.sessionId)
  }

  public setDebug(debug: boolean) {
    this.debug = debug
  }

  public command(name: string, data: any, convertToJSON: boolean = true): Promise<any> {
    this.helper = new BroadsoftXMLHelper()
    this.helper.setCommandName(name)
    this.helper.setCommandData(data)

    const commandXml = this.helper.getXml()

    this.client.write(commandXml)

    if (this.debug) {
      console.log(commandXml)
    }

    return new Promise((res, rej) => {
      let completeData = ""

      this.client.on("error", (data: any) => {
        rej(data.toString())
      })

      // not getting enough data after command
      this.client.on("data", (data: any) => {
        try {
          completeData += data.toString()

          var parsed = this.parser.parseStringPromise(completeData)

          parsed.then(data => {
            if (completeData.includes('</BroadsoftDocument>')) {
              if (this.debug) {
                console.log(completeData)
              }
              
              if (convertToJSON) {
                if (this.logXml) {
                  this.log.push({
                    request: commandXml,
                    response: completeData
                  })
                }
                res(this.helper.parser.toJson(completeData))

              } else {
                res(completeData)
              }

              completeData = ""
            }
          })
          
          parsed.catch(err => {})
        } catch (err) {
          rej(err)
        }
      })
    })
  }

  public async login() {
    return new Promise(async (resolve, reject) => {
      this.client.connect(this.port, this.host, async () => {
        const authenticationResponse = await this.command("AuthenticationRequest", { userId: this.username })
        const nonce = authenticationResponse['BroadsoftDocument']['command'][0]['nonce'][0]

        const pwdEncoded = crypto
          .createHash("sha1")
          .update(this.password)
          .digest("hex")

        const signedPassword = crypto
          .createHash("md5")
          .update(`${nonce.toString()}:${pwdEncoded}`)
          .digest("hex")

        this.signedPassword = signedPassword

        const loginResponsePromise = this.command("LoginRequest14sp4", {
          userId: this.username,
          signedPassword: this.signedPassword
        })

        loginResponsePromise
          .then((response: any) => resolve(response))
          .catch((response: any) => reject(Error(response)))
      })
    })
  }

  public die() {
    this.client.destroy()
  }
}

export class BroadsoftDataUtility {
  public static isError(document: BroadsoftDocument) {
    let response = true
    try {
      response = document.command.$["xsi:type"].includes('Error')
    } catch (err) {
      response = document.command[0].$["xsi:type"].includes('Error')
    }
    return response
  }

  public static sentenceToCamelCase(_s: string) {
    if (_s.length < 2) { return _s }
    let s = _s[0].toLowerCase()
    let chars = _s.split('')
    chars.shift()
    chars.forEach((char, index, arr) => {
      if (char == ' ') {
        arr[index + 1] = arr[index + 1].toUpperCase()
      } else {
        s += char
      }
    })
    return s
  }

  public static parseOciTable(ociTable: any, names?: string[]): any {
    if (names) {
      const m = names.map((name: string, i: number) => {
        const n = ociTable[i]
        const ch = n.colHeading

        if (n.row) {
          let o = n.row.map((row: any, j: number) => {
            let data = row.col

            return data.reduce((p: any, c: any, k: number) => { return { ...p, [BroadsoftDataUtility.sentenceToCamelCase(ch[k])]: c } }, {})
          })

          return {
            name,
            items: o
          }
        }
      })

      return m
    } else {

      let table: any = [];

      let colHeadings = ociTable.colHeading.map((heading: string) => {
        return BroadsoftDataUtility.sentenceToCamelCase(heading)
      });

      ociTable.row.forEach((colRoot: { col: any[] }) => {
        //TODO: these abstract objects should be simpleTypes or complexTypes to ensure data typing
        let colData: any = {}
        colRoot.col.forEach((col: any, index: string | number) => {
          colData[colHeadings[index]] = col
        })
        table.push(colData)
      })

      return table
    }
  }

}
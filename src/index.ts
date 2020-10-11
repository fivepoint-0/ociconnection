import net from 'net'
import crypto from 'crypto'
import { Parser } from 'xml2js'
import { BroadsoftDocument, BroadsoftXMLHelper } from './xml'
import BroadsoftDataUtility from './dataUtil'

class OCIConnection {
  public sessionId: string
  private host: any
  private port: any
  private parser: Parser
  private client: net.Socket
  private helper: BroadsoftXMLHelper
  private password: any
  private username: any
  private signedPassword: any

  constructor(host: string, port: string, username: string, password: string) {
    this.host = host
    this.port = port
    this.username = username
    this.password = password
    this.signedPassword = ''
    this.parser = new Parser()
    this.client = new net.Socket()
    this.helper = new BroadsoftXMLHelper()
    this.sessionId = Math.floor(Math.random() * 100000000000000).toString()

    this.helper.setSessionId(this.sessionId)
  }

  public command(name: string, data: any, convertToJSON: boolean = true): any {

    this.helper.setCommandName(name)
    this.helper.setCommandData(data)

    this.client.write(this.helper.getXml())

    let completeData = ""

    return new Promise((res, rej) => {

      this.client.on("error", (data: any) => {
        rej(data.toString())
      })

      // not getting enough data after command
      this.client.on("data", (data: any) => {
        completeData += data.toString()
        this.parser.parseString(completeData, (err: any, data: any) => {
          if (!err && completeData.includes('</BroadsoftDocument>')) {
            if (convertToJSON) {
              res(this.helper.parser.toJson(completeData))
            } else {
              res(completeData)
            }
          }
        })
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

  public static isError(document: BroadsoftDocument) {
    return document.command.$["xsi:type"] === 'ErrorResponse'
  }

  public die() {
    this.client.destroy()
  }
}

export {
  OCIConnection,
  BroadsoftDataUtility
}
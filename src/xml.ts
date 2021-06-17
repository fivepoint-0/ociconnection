/// <reference types="xml2js" />
import xml2js from 'xml2js'

export abstract class XMLParser {
  abstract toXml (json: object|string): string
  abstract toJson (xml: object|string): Promise<any>|object
}


export default class Xml2JsXMLParser extends XMLParser {
  
  private parser: xml2js.Parser
  private builder: xml2js.Builder
  //

  constructor () {
    super()
    this.parser = new xml2js.Parser()
    this.builder = new xml2js.Builder()
  }

  toJson (xml: string): Promise<any> {
    return this.parser.parseStringPromise(xml)
  }

  toXml (json: object|string): string {
    return this.builder.buildObject(json)
  }
}

export type XMLRootDocumentAttributes = {
  version: "1.0",
  encoding: "ISO-8859-1"
}

export type BroadsoftDocumentAttributes = {
  "protocol": "OCI",
  "xmlns": "C",
  "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
}

export class BroadsoftDocument {
  $!: BroadsoftDocumentAttributes
  sessionId!: {
    $: {
      "xmlns": ""
    }
    _: string | string[]
  }
  command: IOCICommand = {
    $: {
      "xsi:type": "",
      "echo": "",
      "xmlns": ""
    }
  }
}

export interface IOCICommand {
  $: {
    "xmlns"?: string,
    "echo"?: string
    "xsi:type": string
  },
  [key: string]: any
}

export class BroadsoftXMLHelper {
  baseBody: BroadsoftDocument = {
    $: {
      "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "protocol": "OCI",
      "xmlns": "C"
    },
    sessionId: {
      $: {
        "xmlns": ""
      },
      _: ''
    },
    command: {
      $: {
        "xmlns": "",
        "echo": "",
        "xsi:type": ""
      }
    }
  }

  parser: Xml2JsXMLParser = new Xml2JsXMLParser()

  setSessionId(sessionId: string) {
    this['baseBody']['sessionId']['_'] = [sessionId]
  }

  getSessionId() {
    return this['baseBody']['sessionId']['_']
  }

  setCommandName(commandName: string) {
    this['baseBody']['command']['$']['xsi:type'] = commandName
  }

  getCommandName() {
    return this['baseBody']['command']['$']['xsi:type']
  }

  setCommandData(data: any) {
    let attributesCopy = this['baseBody']['command']['$']

    this['baseBody']['command'] = { '$': attributesCopy }

    for (let key in data) {
      this['baseBody']['command'][key] = data[key]
    }
  }

  getCommandData() {
    return this['baseBody']['command']
  }

  getXml() {
    return this.parser.toXml({
      BroadsoftDocument: this.baseBody
    })
  }

}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadsoftXMLHelper = exports.BroadsoftDocument = exports.XMLParser = void 0;
const tslib_1 = require("tslib");
/// <reference types="xml2js" />
const xml2js_1 = tslib_1.__importDefault(require("xml2js"));
class XMLParser {
}
exports.XMLParser = XMLParser;
class Xml2JsXMLParser extends XMLParser {
    constructor() {
        super();
        this.parser = new xml2js_1.default.Parser();
        this.builder = new xml2js_1.default.Builder();
    }
    toJson(xml) {
        return this.parser.parseStringPromise(xml);
    }
    toXml(json) {
        return this.builder.buildObject(json);
    }
}
exports.default = Xml2JsXMLParser;
class BroadsoftDocument {
    constructor() {
        this.command = {
            $: {
                "xsi:type": "",
                "echo": "",
                "xmlns": ""
            }
        };
    }
}
exports.BroadsoftDocument = BroadsoftDocument;
class BroadsoftXMLHelper {
    constructor() {
        this.baseBody = {
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
        };
        this.parser = new Xml2JsXMLParser();
    }
    setSessionId(sessionId) {
        this['baseBody']['sessionId']['_'] = sessionId;
    }
    getSessionId() {
        return this['baseBody']['sessionId']['_'];
    }
    setCommandName(commandName) {
        this['baseBody']['command']['$']['xsi:type'] = commandName;
    }
    getCommandName() {
        return this['baseBody']['command']['$']['xsi:type'];
    }
    setCommandData(data) {
        let attributesCopy = this['baseBody']['command']['$'];
        this['baseBody']['command'] = { '$': attributesCopy };
        for (let key in data) {
            this['baseBody']['command'][key] = data[key];
        }
    }
    getCommandData() {
        return this['baseBody']['command'];
    }
    getXml() {
        return this.parser.toXml({
            BroadsoftDocument: this.baseBody
        });
    }
}
exports.BroadsoftXMLHelper = BroadsoftXMLHelper;
//# sourceMappingURL=index.js.map
export declare abstract class XMLParser {
    abstract toXml(json: object | string): string;
    abstract toJson(xml: object | string): Promise<any> | object;
}
export default class Xml2JsXMLParser extends XMLParser {
    private parser;
    private builder;
    constructor();
    toJson(xml: string): Promise<any>;
    toXml(json: object | string): string;
}
export declare type XMLRootDocumentAttributes = {
    version: "1.0";
    encoding: "ISO-8859-1";
};
export declare type BroadsoftDocumentAttributes = {
    "protocol": "OCI";
    "xmlns": "C";
    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance";
};
export declare class BroadsoftDocument {
    $: BroadsoftDocumentAttributes;
    sessionId: {
        $: {
            "xmlns": "";
        };
        _: string | string[];
    };
    command: IOCICommand;
}
export interface IOCICommand {
    $: {
        "xmlns"?: string;
        "echo"?: string;
        "xsi:type": string;
    };
    [key: string]: any;
}
export declare class BroadsoftXMLHelper {
    baseBody: BroadsoftDocument;
    parser: Xml2JsXMLParser;
    setSessionId(sessionId: string): void;
    getSessionId(): string | string[];
    setCommandName(commandName: string): void;
    getCommandName(): string;
    setCommandData(data: any): void;
    getCommandData(): IOCICommand;
    getXml(): string;
}
//# sourceMappingURL=xml.d.ts.map
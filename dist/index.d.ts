import { BroadsoftDocument } from './xml';
export declare class OCIConnection {
    log: Array<{
        request: string;
        response: string;
    }>;
    sessionId: string;
    private host;
    private port;
    private parser;
    private client;
    private helper;
    private password;
    private username;
    private debug;
    private signedPassword;
    private logXml;
    constructor(host: string, port: string, username: string, password: string, debug?: boolean, log?: boolean);
    setDebug(debug: boolean): void;
    command(name: string, data: any, convertToJSON?: boolean): Promise<any>;
    login(): Promise<unknown>;
    die(): void;
}
export declare class BroadsoftDataUtility {
    static isError(document: BroadsoftDocument): boolean;
    static sentenceToCamelCase(_s: string): string;
    static parseOciTable(ociTable: any, names?: string[]): any;
}
//# sourceMappingURL=index.d.ts.map
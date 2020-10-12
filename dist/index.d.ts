import { BroadsoftDocument } from './xml';
export declare class OCIConnection {
    sessionId: string;
    private host;
    private port;
    private parser;
    private client;
    private helper;
    private password;
    private username;
    private signedPassword;
    constructor(host: string, port: string, username: string, password: string);
    command(name: string, data: any, convertToJSON?: boolean): any;
    login(): Promise<unknown>;
    static isError(document: BroadsoftDocument): boolean;
    die(): void;
}
export declare class BroadsoftDataUtility {
    static sentenceToCamelCase(_s: string): string;
    static parseOciTable(ociTable: any): any;
}
//# sourceMappingURL=index.d.ts.map
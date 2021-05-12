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
    private debug;
    private signedPassword;
    constructor(host: string, port: string, username: string, password: string, debug?: boolean);
    setDebug(debug: boolean): void;
    command(name: string, data: any, convertToJSON?: boolean): Promise<any>;
    login(): Promise<unknown>;
    die(): void;
    static isError(document: BroadsoftDocument): boolean;
}
export declare class BroadsoftDataUtility {
    static isError(document: BroadsoftDocument): boolean;
    static sentenceToCamelCase(_s: string): string;
    static parseOciTable(ociTable: any, names?: string[]): any;
}
//# sourceMappingURL=index.d.ts.map
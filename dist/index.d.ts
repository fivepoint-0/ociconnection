export declare class OCIConnection {
    private username;
    private signedPassword;
    private host;
    private port;
    private password;
    private client;
    sessionId: string;
    private parser;
    private helper;
    constructor(host: string, port: string, username: string, password: string);
    command(name: string, data: any, convertToJsonStructure?: boolean): any;
    login(): Promise<unknown>;
}
//# sourceMappingURL=index.d.ts.map
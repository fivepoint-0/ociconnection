import { BroadsoftDocument } from './xml';
import BroadsoftDataUtility from './dataUtil';
declare class OCIConnection {
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
}
declare const _default: {
    OCIConnection: typeof OCIConnection;
    BroadsoftDataUtility: typeof BroadsoftDataUtility;
};
export default _default;
//# sourceMappingURL=index.d.ts.map
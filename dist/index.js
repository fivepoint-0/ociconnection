"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OCIConnection = void 0;
const tslib_1 = require("tslib");
const net_1 = tslib_1.__importDefault(require("net"));
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const xml2js_1 = require("xml2js");
const xml_1 = require("./xml");
class OCIConnection {
    constructor(host, port, username, password) {
        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
        this.signedPassword = '';
        this.parser = new xml2js_1.Parser();
        this.client = new net_1.default.Socket();
        this.helper = new xml_1.BroadsoftXMLHelper();
        this.sessionId = Math.floor(Math.random() * 100000000000000).toString();
        this.helper.setSessionId(this.sessionId);
    }
    command(name, data, convertToJSON = true) {
        this.helper.setCommandName(name);
        this.helper.setCommandData(data);
        this.client.write(this.helper.getXml());
        let completeData = "";
        return new Promise((res, rej) => {
            this.client.on("error", (data) => {
                rej(data.toString());
            });
            // not getting enough data after command
            this.client.on("data", (data) => {
                completeData += data.toString();
                this.parser.parseString(completeData, (err, data) => {
                    if (!err) {
                        if (convertToJSON) {
                            res(this.helper.parser.toJson(completeData));
                        }
                        else {
                            res(completeData);
                        }
                    }
                });
            });
        });
    }
    login() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                this.client.connect(this.port, this.host, () => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    const authenticationResponse = yield this.command("AuthenticationRequest", { userId: this.username });
                    const nonce = authenticationResponse['BroadsoftDocument']['command'][0]['nonce'][0];
                    const pwdEncoded = crypto_1.default
                        .createHash("sha1")
                        .update(this.password)
                        .digest("hex");
                    const signedPassword = crypto_1.default
                        .createHash("md5")
                        .update(`${nonce.toString()}:${pwdEncoded}`)
                        .digest("hex");
                    this.signedPassword = signedPassword;
                    const loginResponsePromise = this.command("LoginRequest14sp4", {
                        userId: this.username,
                        signedPassword: this.signedPassword
                    });
                    loginResponsePromise
                        .then((response) => resolve(response))
                        .catch((response) => reject(Error(response)));
                }));
            }));
        });
    }
    static isError(document) {
        return document.command.$["xsi:type"] === 'ErrorResponse';
    }
}
exports.OCIConnection = OCIConnection;
//# sourceMappingURL=index.js.map
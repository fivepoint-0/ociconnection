"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BroadsoftDataUtility = exports.OCIConnection = void 0;
const tslib_1 = require("tslib");
const net_1 = tslib_1.__importDefault(require("net"));
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const xml2js_1 = require("xml2js");
const xml_1 = require("./xml");
class OCIConnection {
    constructor(host, port, username, password, debug = false) {
        this.debug = false;
        this.host = host;
        this.port = port;
        this.username = username;
        this.password = password;
        this.signedPassword = '';
        this.parser = new xml2js_1.Parser();
        this.client = new net_1.default.Socket();
        this.helper = new xml_1.BroadsoftXMLHelper();
        this.sessionId = Math.floor(Math.random() * 100000000000000).toString();
        this.setDebug(debug);
        this.helper.setSessionId(this.sessionId);
    }
    setDebug(debug) {
        this.debug = debug;
    }
    command(name, data, convertToJSON = true) {
        this.helper = new xml_1.BroadsoftXMLHelper();
        this.helper.setCommandName(name);
        this.helper.setCommandData(data);
        const commandXml = this.helper.getXml();
        this.client.write(commandXml);
        if (this.debug) {
            console.log(commandXml);
        }
        let completeData = "";
        return new Promise((res, rej) => {
            this.client.on("error", (data) => {
                rej(data.toString());
            });
            // not getting enough data after command
            this.client.on("data", (data) => {
                try {
                    completeData += data.toString();
                    var parsed = this.parser.parseStringPromise(completeData);
                    parsed.then(data => {
                        if (completeData.includes('</BroadsoftDocument>')) {
                            if (this.debug) {
                                console.log(completeData);
                            }
                            if (convertToJSON) {
                                res(this.helper.parser.toJson(completeData));
                            }
                            else {
                                res(completeData);
                            }
                        }
                    });
                    parsed.catch(err => { });
                    // this.parser.parseString(completeData, (err: any, data: any) => {
                    //   if (!err && completeData.includes('</BroadsoftDocument>')) {
                    //     if (this.debug) {
                    //       console.log(completeData)
                    //     }
                    //     if (convertToJSON) {
                    //       res(this.helper.parser.toJson(completeData))
                    //     } else {
                    //       res(completeData)
                    //     }
                    //   }
                    // })
                }
                catch (err) {
                    rej(err);
                }
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
    die() {
        this.client.destroy();
    }
    static isError(document) {
        let response = true;
        try {
            response = document.command.$["xsi:type"].includes('Error');
        }
        catch (err) {
            response = document.command[0].$["xsi:type"].includes('Error');
        }
        return response;
    }
}
exports.OCIConnection = OCIConnection;
class BroadsoftDataUtility {
    static isError(document) {
        let response = true;
        try {
            response = document.command.$["xsi:type"].includes('Error');
        }
        catch (err) {
            response = document.command[0].$["xsi:type"].includes('Error');
        }
        return response;
    }
    static sentenceToCamelCase(_s) {
        if (_s.length < 2) {
            return _s;
        }
        let s = _s[0].toLowerCase();
        let chars = _s.split('');
        chars.shift();
        chars.forEach((char, index, arr) => {
            if (char == ' ') {
                arr[index + 1] = arr[index + 1].toUpperCase();
            }
            else {
                s += char;
            }
        });
        return s;
    }
    static parseOciTable(ociTable, names) {
        if (names) {
            const m = names.map((name, i) => {
                const n = ociTable[i];
                const ch = n.colHeading;
                if (n.row) {
                    let o = n.row.map((row, j) => {
                        let data = row.col;
                        return data.reduce((p, c, k) => { return Object.assign(Object.assign({}, p), { [BroadsoftDataUtility.sentenceToCamelCase(ch[k])]: c }); }, {});
                    });
                    return {
                        name,
                        items: o
                    };
                }
            });
            return m;
        }
        else {
            let table = [];
            let colHeadings = ociTable.colHeading.map((heading) => {
                return BroadsoftDataUtility.sentenceToCamelCase(heading);
            });
            ociTable.row.forEach((colRoot) => {
                //TODO: these abstract objects should be simpleTypes or complexTypes to ensure data typing
                let colData = {};
                colRoot.col.forEach((col, index) => {
                    colData[colHeadings[index]] = col;
                });
                table.push(colData);
            });
            return table;
        }
    }
}
exports.BroadsoftDataUtility = BroadsoftDataUtility;
//# sourceMappingURL=index.js.map
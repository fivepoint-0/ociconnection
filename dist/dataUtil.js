"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BroadsoftDataUtility {
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
    static parseOciTable(ociTable) {
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
exports.default = BroadsoftDataUtility;
//# sourceMappingURL=dataUtil.js.map
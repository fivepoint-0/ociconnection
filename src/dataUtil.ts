export default class BroadsoftDataUtility {
  public static sentenceToCamelCase(_s: string) {
    if (_s.length < 2) { return _s }
    let s = _s[0].toLowerCase()
    let chars = _s.split('')
    chars.shift()
    chars.forEach((char, index, arr) => {
        if (char == ' ') {
            arr[index+1] = arr[index+1].toUpperCase()
        } else {
            s += char
        }
    })
    return s
  }
  
  public static parseOciTable(ociTable: any): any { 
    let table: any = [];
  
    let colHeadings = ociTable.colHeading.map((heading: string) => {
        return BroadsoftDataUtility.sentenceToCamelCase(heading);
    });
  
    ociTable.row.forEach((colRoot: { col: any[] }) => {
        //TODO: these abstract objects should be simpleTypes or complexTypes to ensure data typing
        let colData: any = {}
        colRoot.col.forEach((col: any, index: string | number) => {
            colData[colHeadings[index]] = col;
        })
        table.push(colData)
    })
    
    return table;
  }
}
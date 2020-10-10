# Welcome to the Broadsoft OCI Application Server Helper Class!

## Changes:

### 1.0.10: Added a data utility to help with return data from BroadWorks

- Added OCITable helper static function `BroadsoftDataUtility.parseOciTable` to convert e.g. `ociResponse.BroadsoftDocument.command[0].userTable[0]` from 
```ts
import { OCIConnection } from 'ociconnection'
import BroadsoftDataUtility from 'ociconnection'

const ociConnection = new OCIConnection('1.1.1.1', '3333', 'broadworks_user', 'broadworks_password')

await ociConnection.login()
/*
Or instead of `await ociConnection.login()`:
  const loggedIn = ociConnection.login()
  loggedIn
    .then(() => {
    / * code that happens after successful response from server * /
    })
    .catch(() => {
    / * code that happens after failed response from server * /
    })

*/
const ociResponse = await ociConnection.command('UserGetListInServiceProviderRequest', {
    serviceProviderId: <string>enterpriseId
})
/*
Or instead of using `await` here:
  const ociResponse = ociConnection.command(...)

  ociResponse
    .then(response => / * Deal with XML/object response here * /)
    .catch(serverError => / * Deal with server error here * /)
*/

const table = BroadsoftDataUtility.parseOciTable(ociResponse.BroadsoftDocument.command[0].userTable[0])

console.log(table) 

```

### 1.0.8: Had an issue with receiving entire BroadsoftDocument in parser under the `command` function.

### 1.0.4: Added 'isError' static function to OCIConnection class. Took out console logs.
Hi! And welcome. **ociconnection** is a module used to connect to a Broadsoft/BroadWorks Application Server. This package is available at npmjs.org 

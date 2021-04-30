# Welcome to the Broadsoft OCI Application Server Helper Class!

## Changes:

### 1.0.26: Added extra check on the isError function 

### 1.0.25: No changes to code 

### 1.0.: No changes to code 

### 1.0.24: No code changes for patch 24 

### 1.0.23: No code changes for patch 23 

### 1.0.22: Now building project automatically before publishing.

### 1.0.21: Built project.

### 1.0.20: No breaking changes yet. Had to update the isError function. 

### 1.0.19: Added debug function to OCIConnection class. The next version will be a breaking change. 

Changelog:
- Added `setDebug(boolean)` function to the OCIConenction class. This will output the command XML and response XML when `command()` is called.
- Copied the `isError()` function from the `OCIConnection` class to the `BroadsoftDataUtility` class. In the next version, that function will be removed from the `OCIConnection` class, causing a possible breaking change for some.

### 1.0.18: Added _dist/_ folder again because of type declarations.

### 1.0.17: Fixed parseOciTable and removed _dist/_ folder.

### 1.0.16: Added another data utility function for parseOciTable. 

An example of the arguments would be from a response like ServiceProviderServicePackGetUtilizationListResponse:

```ts
const commandResponse = ServiceProviderServicePackGetUtilizationListResponse
  .BroadsoftDocument
  .command[0]

const table = commandResponse.serviceUtilizationTable
const names = commandResponse.servicePackNames

const tableData = BroadsoftDataUtility.parseOciTable(table, names)

// Example format for output:

let response = [
  {
    "name": "ServicePack1",
    "items": [
        {
            "group": "GROUP_ONE",
            "totalPacks": "3",
            "assigned": "3"
        },
        {
            "group": "GROUP_THREE",
            "totalPacks": "3",
            "assigned": "3"
        }
    ]
  },
  {
    "name": "ServicePack2",
    "items": [
        {
            "group": "GROUP_TWO",
            "totalPacks": "10",
            "assigned": "10"
        }
    ]
  }
]
```

### 1.0.12: Added _dotenv_ and _jest_ to test Broadsoft data utility and main class function calls for better development. Planning to add easy docker deployment to this project for 1.0.13.

Easy Setup for project using _dotenv_ and _ociconnection_:

`.env` File Setup:
```dotenv
BROADSOFT_TEST_HOST=<IP ADDRESS/HOST NAME OF OCI SERVER HERE>
BROADSOFT_TEST_PORT=<PORT FOR APPLICATION SERVER API>
BROADSOFT_TEST_USERNAME=<OCI_USERNAME_HERE>
BROADSOFT_TEST_PASSWORD=<OCI_PASSWORD_HERE>
```


`index.ts` Minimal File Setup:
```ts
import { OCIConnection } from 'ociconnection'

const main = async () => {

  const ociConnection = new OCIConnection(
    <string>process.env.BROADSOFT_TEST_HOST,
    <string>process.env.BROADSOFT_TEST_PORT,
    <string>process.env.BROADSOFT_TEST_USERNAME,
    <string>process.env.BROADSOFT_TEST_PASSWORD
  )

  await ociConnection.login()
}

main()
```

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

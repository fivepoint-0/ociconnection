import { BroadsoftDataUtility, OCIConnection } from '../src'
import dotenv from 'dotenv'

dotenv.config()

test('OCITable should parse', async () => {
  const testConnection = new OCIConnection(
    <string>process.env.BROADSOFT_TEST_HOST,
    <string>process.env.BROADSOFT_TEST_PORT,
    <string>process.env.BROADSOFT_TEST_USERNAME,
    <string>process.env.BROADSOFT_TEST_PASSWORD
  )

  await testConnection.login()

  const ociResponse = await testConnection.command('UserGetListInServiceProviderRequest', {
    serviceProviderId: <string>process.env.BROADSOFT_TEST_ENTERPRISEID
  })

  const table = BroadsoftDataUtility.parseOciTable(ociResponse.BroadsoftDocument.command[0].userTable[0])

  await testConnection.die()

  if ( table.length !== 0 ) {

    expect(table[0]).toHaveProperty('userId')
    expect(table[0]).toHaveProperty('groupId')
    expect(table[0]).toHaveProperty('lastName')
    expect(table[0]).toHaveProperty('firstName')
    expect(table[0]).toHaveProperty('department')
    expect(table[0]).toHaveProperty('phoneNumber')
    expect(table[0]).toHaveProperty('phoneNumberActivated')
    expect(table[0]).toHaveProperty('emailAddress')
    expect(table[0]).toHaveProperty('hiraganaLastName')
    expect(table[0]).toHaveProperty('hiraganaFirstName')
    expect(table[0]).toHaveProperty('inTrunkGroup')
    expect(table[0]).toHaveProperty('extension')
  }
})


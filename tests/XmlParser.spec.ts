import xml2js from 'xml2js'

var parser = new xml2js.Parser()

var str = `<?xml version="1.0" encoding="ISO-8859-1"?>
<BroadsoftDocument protocol="OCI"
	xmlns="C"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
	<sessionId
		xmlns="">
	</sessionId>
	<command type="Error" echo="" xsi:type="c:ErrorResponse"
		xmlns:c="C"
		xmlns="">
		<summary>[Error 4400] Could not assign service/service pack: UPGR-Webex-from-Collab</summary>
		<summaryEnglish>[Error 4400] Could not assign service/service pack: UPGR-Webex-from-Collab</summaryEnglish>
		<detail>UPGR-Webex-from-Collab: Service pack license limit is reached.</detail>
	</command>
</BroadsoftDocument>`

var parsed = parser.parseStringPromise(str)

parsed.then(data => console.log(JSON.stringify(data, null, 2))).catch(err => console.log('ERROR', err))

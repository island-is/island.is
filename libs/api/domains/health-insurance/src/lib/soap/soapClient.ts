import { logger } from '@island.is/logging'
import * as Soap from 'soap'

/*
 * Because we could not read xroad .wsdl
 * So we have to ready original .wsdl then manual added xroad headers
 * This way we could use 'soap' library to connect to xroad
 */
export class SoapClient {
  static xn = 'xmlns:xrd="http://x-road.eu/xsd/xroad.xsd"'
  static xi = 'xmlns:id="http://x-road.eu/xsd/identifiers"'

  static async generateClient(
    wsdlUrl: string,
    baseUrl: string,
    username: string,
    password: string,
    clientID: string,
    serviceID: string,
    functionName: string,
  ): Promise<Soap.Client | null> {
    logger.info('Starting create soapClient...')

    const clientIDArr = clientID.split('/')
    if (clientIDArr.length != 4) {
      logger.error(`Could not find client Ids from ${clientID}`)
      throw new Error(`Could not find client Ids from ${clientID}`)
    }

    const servicesIDArr = serviceID.split('/')
    if (servicesIDArr.length != 4) {
      logger.error(`Could not find xroad Ids from ${serviceID}`)
      throw new Error(`Could not find xroad Ids from ${serviceID}`)
    }
    // xroad headers
    const xh = `<xrd:protocolVersion ${SoapClient.xn}>4.0</xrd:protocolVersion>
    <xrd:id ${SoapClient.xn}>3903d152-1d2c-11eb-adc1-0242ac120002</xrd:id>
    <xrd:userId ${SoapClient.xn}>anonymous</xrd:userId>
    <xrd:service ${SoapClient.xn} ${SoapClient.xi} id:objectType="SERVICE" >
        <id:xRoadInstance>${servicesIDArr[0]}</id:xRoadInstance>
        <id:memberClass>${servicesIDArr[1]}</id:memberClass>
        <id:memberCode>${servicesIDArr[2]}</id:memberCode>
        <id:subsystemCode>${servicesIDArr[3]}</id:subsystemCode>
        <id:serviceCode>${functionName}</id:serviceCode>
    </xrd:service>
    <xrd:client ${SoapClient.xn} ${SoapClient.xi} id:objectType="SUBSYSTEM" >
        <id:xRoadInstance>${clientIDArr[0]}</id:xRoadInstance>
        <id:memberClass>${clientIDArr[1]}</id:memberClass>
        <id:memberCode>${clientIDArr[2]}</id:memberCode>
        <id:subsystemCode>${clientIDArr[3]}</id:subsystemCode>
    </xrd:client>`

    const promise = new Promise<Soap.Client>((resolve) => {
      Soap.createClient(wsdlUrl, (error, client) => {
        const options = {
          hasTimeStamp: false,
          hasNonce: true,
          mustUnderstand: true,
        }
        if (client) {
          const wsSecurity = new Soap.WSSecurity(username, password, options)
          client.setSecurity(wsSecurity)
          client.addSoapHeader(xh) // have to add xroad headers for it to work
          client.setEndpoint(baseUrl)
          resolve(client)
        } else {
          logger.error('healthInsurance connection failed : ', error)
          resolve(client)
        }
      })
    })
    logger.info('Finished create soapClient...')
    return promise
  }
}

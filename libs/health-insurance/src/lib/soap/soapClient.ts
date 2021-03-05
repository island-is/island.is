import { logger } from '@island.is/logging'
import * as Soap from 'soap'
import { XRoadVariables } from './dto'

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
    servicesID: string,
    functionName: string,
  ): Promise<Soap.Client | null> {
    logger.info('Starting create soapClient...')

    const clientIDs = this.parseXRoadVariables(clientID)
    const serviceIDs = this.parseXRoadVariables(servicesID)

    // xroad headers
    const xh = `<xrd:protocolVersion ${SoapClient.xn}>4.0</xrd:protocolVersion>
    <xrd:id ${SoapClient.xn}>3903d152-1d2c-11eb-adc1-0242ac120002</xrd:id>
    <xrd:userId ${SoapClient.xn}>anonymous</xrd:userId>
    <xrd:service ${SoapClient.xn} ${SoapClient.xi} id:objectType="SERVICE" >
        <id:xRoadInstance>${serviceIDs.xRoadInstance}</id:xRoadInstance>
        <id:memberClass>${serviceIDs.memberClass}</id:memberClass>
        <id:memberCode>${serviceIDs.memberCode}</id:memberCode>
        <id:subsystemCode>${serviceIDs.subSystemCode}</id:subsystemCode>
        <id:serviceCode>${functionName}</id:serviceCode>
    </xrd:service>
    <xrd:client ${SoapClient.xn} ${SoapClient.xi} id:objectType="SUBSYSTEM" >
        <id:xRoadInstance>${clientIDs.xRoadInstance}</id:xRoadInstance>
        <id:memberClass>${clientIDs.memberClass}</id:memberClass>
        <id:memberCode>${clientIDs.memberCode}</id:memberCode>
        <id:subsystemCode>${clientIDs.subSystemCode}</id:subsystemCode>
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

  static parseXRoadVariables(variables: string): XRoadVariables {
    const varArr = variables.split('/')
    if (varArr.length !== 4) {
      logger.error(`Could not find variables Ids from ${variables}`)
      throw new Error(`Could not find variables Ids from ${variables}`)
    }
    const [xRoadInstance, memberClass, memberCode, subSystemCode] = varArr

    return {
      xRoadInstance,
      memberClass,
      memberCode,
      subSystemCode,
    }
  }
}

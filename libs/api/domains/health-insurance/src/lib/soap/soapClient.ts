import { logger } from '@island.is/logging'
import * as Soap from 'soap'

export class SoapClient {
  static xn = 'xmlns:xrd="http://x-road.eu/xsd/xroad.xsd"'
  static xi = 'xmlns:id="http://x-road.eu/xsd/identifiers"'

  static async generateClient(
    wsdlUrl: string,
    baseUrl: string,
    username: string,
    password: string,
    functionName: string,
  ): Promise<Soap.Client | null> {
    const xh = `<xrd:protocolVersion ${SoapClient.xn}>4.0</xrd:protocolVersion>
    <xrd:id ${SoapClient.xn}>3903d152-1d2c-11eb-adc1-0242ac120002</xrd:id>
    <xrd:userId ${SoapClient.xn}>anonymous</xrd:userId>
    <xrd:service ${SoapClient.xn} ${SoapClient.xi} id:objectType="SERVICE" >
        <id:xRoadInstance>IS-DEV</id:xRoadInstance>
        <id:memberClass>GOV</id:memberClass>
        <id:memberCode>10007</id:memberCode>
        <id:subsystemCode>SJUKRA-Protected</id:subsystemCode>
        <id:serviceCode>${functionName}</id:serviceCode>
    </xrd:service>
    <xrd:client ${SoapClient.xn} ${SoapClient.xi} id:objectType="SUBSYSTEM" >
        <id:xRoadInstance>IS-DEV</id:xRoadInstance>
        <id:memberClass>GOV</id:memberClass>
        <id:memberCode>10000</id:memberCode>
        <id:subsystemCode>island-is-client</id:subsystemCode>
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
          client.addSoapHeader(xh)
          client.setEndpoint(baseUrl)
          resolve(client)
        } else {
          logger.error('healthInsurance connection failed : ', error)
          resolve(client)
        }
      })
    })
    return promise
  }
}

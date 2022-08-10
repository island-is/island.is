import { logger } from '@island.is/logging'
import * as Soap from 'soap'

export class SoapClient {
  static async generateClient(
    baseUrl: string,
    host: string,
  ): Promise<Soap.Client | null> {
    console.log('SOAP CLIENT !')
    const promise = new Promise<Soap.Client>((resolve) => {
      Soap.createClient(
        `${baseUrl}/islws/service.asmx?WSDL`,
        {
          // eslint-disable-next-line
          wsdl_headers: { Host: host },
        },
        (error, client) => {
          if (client) {
            client.setEndpoint(`${baseUrl}/islws/service.asmx`)
            client.addHttpHeader('Host', host)
            resolve(client)
          } else {
            logger.error('NationalRegistry connection failed : ', error)
            resolve(client)
          }
        },
      )
    })
    return promise
  }
}

export class SoapClient2 {
  static async generateClient(
    baseUrl: string,
    host: string,
  ): Promise<Soap.Client | null> {
    console.log('SOAP CLIENT 666!')
    const promise = new Promise<Soap.Client>((resolve) => {
      Soap.createClient(
        // `${baseUrl}/islws/Service.asmx?WSDL`,
        `${baseUrl}/islws/service.asmx?WSDL`,
        {
          // eslint-disable-next-line
          wsdl_headers: { Host: host },
        },
        (error, client) => {
          if (client) {
            client.setEndpoint(`${baseUrl}/islws/service.asmx`)
            // client.setEndpoint(
            //   `${baseUrl}/islws/Service.asmx?op=CreateAndUpdateMS_Leidretting`,
            // )
            client.addHttpHeader('Host', host)
            console.log('client.describe()', client.describe())
            resolve(client)
          } else {
            logger.error('NationalRegistry connection failed : ', error)
            resolve(client)
          }
        },
      )
    })
    return promise
  }
}

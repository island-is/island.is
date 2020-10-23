import { logger } from '@island.is/logging'
import { exception } from 'console'
import * as Soap from 'soap'

export class SoapClient {
  static async generateClient(
    baseUrl: string,
    host: string,
  ): Promise<Soap.Client | null> {
    const promise = new Promise<Soap.Client>((resolve, reject) => {
      Soap.createClient(
        `${baseUrl}/lisaws/service.asmx?WSDL`,
        {
          // eslint-disable-next-line
          wsdl_headers: { Host: host },
        },
        (error, client) => {
          if (client) {
            client.setEndpoint(`${baseUrl}/lisaws/service.asmx`)
            client.addHttpHeader('Host', host)
            resolve(client)
          } else {
            logger.info('NationalRegistry connection failed', error)
            resolve(error)
          }
        },
      )
    })
    return promise
  }
}

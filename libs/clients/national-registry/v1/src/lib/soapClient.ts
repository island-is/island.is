import { logger } from '@island.is/logging'
import * as Soap from 'soap'

const WSDL_REQUEST_TIMEOUT = 10 * 1000

export class SoapClient {
  static async generateClient(
    baseUrl: string,
    host: string,
  ): Promise<Soap.Client | null> {
    const promise = new Promise<Soap.Client>((resolve) => {
      Soap.createClient(
        `${baseUrl}/islws/service.asmx?WSDL`,
        {
          // eslint-disable-next-line
          wsdl_headers: { Host: host },
          wsdl_options: {
            timeout: WSDL_REQUEST_TIMEOUT,
          },
        },
        (error, client) => {
          if (client) {
            client.setEndpoint(`${baseUrl}/islws/service.asmx`)
            client.addHttpHeader('Host', host)
            logger.info(`NationalRegistry soap started : ${baseUrl}`)
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

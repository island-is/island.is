import { logger } from '@island.is/logging';
import * as Soap from 'soap'

export class SoapClient {
  static async generateClient(baseUrl: string, host: string): Promise<Soap.Client> {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    return new Promise<Soap.Client>((resolve, reject) => {
      Soap.createClient(`${baseUrl}/lisaws/service.asmx?WSDL`,
        { wsdl_headers: { Host: host } },
        (error, client) => {
          if (error) {
            //TODO log to provider
            logger.error(error)
            reject(error);
          }
          client.setEndpoint(`${baseUrl}/lisaws/service.asmx`);
          client.addHttpHeader("Host", host);
          resolve(client);
        })
    })
  }
}

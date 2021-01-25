import { InternalServerErrorException, Inject, Injectable } from '@nestjs/common'
import { getViewSjukraTryggdurDto, SjukratryggdurType } from './dto'

import { SoapClient } from './soapClient'

import { logger } from '@island.is/logging'

export const HEALTH_INSURANCE_CONFIG = 'HEALTH_INSURANCE_CONFIG'

export interface HealthInsuranceConfig {
  wsdlUrl: string
  baseUrl: string
  username: string
  password: string
}

@Injectable()
export class HealthInsuranceAPI {
    constructor(
        @Inject(HEALTH_INSURANCE_CONFIG)
        private clientConfig: HealthInsuranceConfig,
    ) {}

    public async getProfun(): Promise<string> {
        const client = await SoapClient.generateClient(this.clientConfig.wsdlUrl, this.clientConfig.baseUrl, this.clientConfig.username, this.clientConfig.password, 'profun')
        return new Promise((resolve, reject) => {
            if (!client) {
                throw new InternalServerErrorException('HealthInsurance Soap Client not initialized')
            }
            return client.profun({
                sendandi: '',
            }, function (err: any, result: any) {
                if(err){
                    reject(err)
                }
                resolve(result['ProfunType']['radnumer_si'] ? result['ProfunType']['radnumer_si'] : null)
            });
        });
    }

    public async isHealthInsured(nationalId: string): Promise<SjukratryggdurType>{
        const client = await SoapClient.generateClient(this.clientConfig.wsdlUrl, this.clientConfig.baseUrl, this.clientConfig.username, this.clientConfig.password, 'sjukratryggdur')
        return new Promise((resolve, reject) => {
            if (!client) {
                logger.error('HealthInsurance Soap Client not initialized')
                throw new InternalServerErrorException('HealthInsurance Soap Client not initialized')
            }
            console.log(JSON.stringify(client.describe(), null, 2))
            client.sjukratryggdur({
                sendandi: '',
                kennitala: nationalId,
                dagsetning: Date.now(),
            }, function (err: any, result: any) {
                if(err){
                    logger.error(JSON.stringify(err, null, 2))
                    reject(err)
                }
                else if(!result['SjukratryggdurType']){
                    logger.error(`Something went totally wrong in 'Sjukratryggdur' call with result: ${JSON.stringify(result, null, 2)}`)
                    reject(result)
                }
                else {
                    if(!result['SjukratryggdurType']['sjukratryggdur']){
                        logger.error(`Something went totally wrong in 'Sjukratryggdur' call with result: ${JSON.stringify(result, null, 2)}`)
                        reject(result)
                    }
                    else{
                        console.log(JSON.stringify(result, null, 2))
                        logger.info(`Successful get sjukratryggdur information for ${nationalId} with result: ${JSON.stringify(result, null, 2)}`)
                        resolve(result)
                    }
                }
            });
        });
    }
}

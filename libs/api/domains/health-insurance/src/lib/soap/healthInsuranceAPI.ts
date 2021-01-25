import {
  InternalServerErrorException,
  Inject,
  Injectable,
} from '@nestjs/common'
import { logger } from '@island.is/logging'

import { GetSjukratryggdurTypeDto } from './dto'
import { SoapClient } from './soapClient'

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
    const client = await SoapClient.generateClient(
      this.clientConfig.wsdlUrl,
      this.clientConfig.baseUrl,
      this.clientConfig.username,
      this.clientConfig.password,
      'profun',
    )
    return new Promise((resolve, reject) => {
      if (!client) {
        throw new InternalServerErrorException(
          'HealthInsurance Soap Client not initialized',
        )
      }
      return client.profun(
        {
          sendandi: '',
        },
        function (err: any, result: any) {
          if (err) {
            reject(err)
          }
          resolve(
            result['ProfunType']['radnumer_si']
              ? result['ProfunType']['radnumer_si']
              : null,
          )
        },
      )
    })
  }

  // check whether the person is health insured
  public async isHealthInsured(
    nationalId: string,
  ): Promise<GetSjukratryggdurTypeDto> {
    logger.info('--- Starting isHealthInsured api call ---')
    // create 'soap' client
    const client = await SoapClient.generateClient(
      this.clientConfig.wsdlUrl,
      this.clientConfig.baseUrl,
      this.clientConfig.username,
      this.clientConfig.password,
      'sjukratryggdur',
    )
    if (!client) {
      logger.error('HealthInsurance Soap Client not initialized')
      throw new InternalServerErrorException(
        'HealthInsurance Soap Client not initialized',
      )
    }

    return new Promise((resolve, reject) => {
      // call 'sjukratryggdur' function/endpoint
      client.sjukratryggdur(
        {
          sendandi: '',
          kennitala: nationalId,
          dagsetning: Date.now(),
        },
        function (err: any, result: any) {
          if (err) {
            logger.error(JSON.stringify(err, null, 2))
            reject(err)
          } else if (!result.SjukratryggdurType?.sjukratryggdur) {
            logger.error(
              `Something went totally wrong in 'Sjukratryggdur' call with result: ${JSON.stringify(
                result,
                null,
                2,
              )}`,
            )
            reject(result)
          } else {
            logger.info(
            `Successful get sjukratryggdur information for ${nationalId} with result: ${JSON.stringify(
                result,
                null,
                2,
            )}`,
            )
            resolve(result)
        }
        },
      )
    })
  }
}

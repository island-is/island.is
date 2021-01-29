import {
  InternalServerErrorException,
  Inject,
  Injectable,
} from '@nestjs/common'
import { logger } from '@island.is/logging'

import {
  GetSjukratryggdurTypeDto,
  GetFaUmsoknSjukratryggingTypeDto,
} from './dto'
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
    logger.info(`--- Starting isHealthInsured api call for ${nationalId} ---`)
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
          } else if (!result.SjukratryggdurType) {
            logger.error(
              `Something went totally wrong in 'Sjukratryggdur' call for ${nationalId} with result: ${JSON.stringify(
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

  // get user's applications
  public async getApplication(
    nationalId: string,
  ): Promise<GetFaUmsoknSjukratryggingTypeDto> {
    logger.info(`--- Starting getApplication api call for ${nationalId} ---`)
    // create 'soap' client
    const client = await SoapClient.generateClient(
      this.clientConfig.wsdlUrl,
      this.clientConfig.baseUrl,
      this.clientConfig.username,
      this.clientConfig.password,
      'faumsoknirsjukratrygginga',
    )
    if (!client) {
      logger.error('HealthInsurance Soap Client not initialized')
      throw new InternalServerErrorException(
        'HealthInsurance Soap Client not initialized',
      )
    }

    return new Promise((resolve, reject) => {
      // call 'faumsoknirsjukratrygginga' function/endpoint
      client.faumsoknirsjukratrygginga(
        {
          sendandi: '',
          kennitala: nationalId,
        },
        function (err: any, result: any) {
          if (err) {
            logger.error(JSON.stringify(err, null, 2))
            reject(err)
          } else {
            /*
             API returns null when there is no application in the system,
             but it returns also null when the nationalId is not correct,
             we return all reponses to developer to handle them

             Application statuses:
              0: Samþykkt/Accepted
              1: Synjað/Refused
              2: Í bið/Pending
              3: Ógilt/Invalid
            */
            logger.info(
              `Successful get faumsoknirsjukratrygginga information for ${nationalId} with result: ${JSON.stringify(
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

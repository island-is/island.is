import {
  InternalServerErrorException,
  Inject,
  Injectable,
  NotFoundException,
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
    logger.info(`--- Starting getProfun api call ---`)

    const args = {
      sendandi: '',
    }
    const res = await this.xroadCall('profun', args)
    return res.ProfunType.radnumer_si ?? null
  }

  // check whether the person is health insured
  public async isHealthInsured(nationalId: string): Promise<boolean> {
    logger.info(`--- Starting isHealthInsured api call for ${nationalId} ---`)

    const args = {
      sendandi: '',
      kennitala: nationalId,
      dagsetning: Date.now(),
    }
    const res: GetSjukratryggdurTypeDto = await this.xroadCall(
      'sjukratryggdur',
      args,
    )

    if (!res.SjukratryggdurType) {
      logger.error(
        `Something went totally wrong in 'Sjukratryggdur' call for ${nationalId} with result: ${JSON.stringify(
          res,
          null,
          2,
        )}`,
      )
      throw new NotFoundException(`Unexpected results: ${JSON.stringify(res)}`)
    } else {
      logger.info(`--- Finished isHealthInsured api call for ${nationalId} ---`)
      return res.SjukratryggdurType.sjukratryggdur == 1
    }
  }

  // get user's pending applications
  public async getPendingApplication(nationalId: string): Promise<number[]> {
    logger.info(
      `--- Starting getPendingApplication api call for ${nationalId} ---`,
    )

    const args = {
      sendandi: '',
      kennitala: nationalId,
    }
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
    const res: GetFaUmsoknSjukratryggingTypeDto = await this.xroadCall(
      'faumsoknirsjukratrygginga',
      args,
    )

    if (!res.FaUmsoknSjukratryggingType?.umsoknir) {
      logger.info(`return empty array to graphQL`)
      return []
    }

    logger.info(`Start filtering Pending status`)
    // Return all caseIds with Pending status
    const pendingCases: number[] = []
    res.FaUmsoknSjukratryggingType.umsoknir
      .filter((umsokn) => {
        return umsokn.stada == 2
      })
      .forEach((value) => {
        pendingCases.push(value.skjalanumer)
      })

    logger.info(
      `--- Finished getPendingApplication api call for ${nationalId} ---`,
    )
    return pendingCases
  }

  private async xroadCall(functionName: string, args: object): Promise<any> {
    // create 'soap' client
    logger.info(`Start ${functionName} function call.`)
    const client = await SoapClient.generateClient(
      this.clientConfig.wsdlUrl,
      this.clientConfig.baseUrl,
      this.clientConfig.username,
      this.clientConfig.password,
      functionName,
    )
    if (!client) {
      logger.error('HealthInsurance Soap Client not initialized')
      throw new InternalServerErrorException(
        'HealthInsurance Soap Client not initialized',
      )
    }

    return new Promise((resolve, reject) => {
      // call 'faumsoknirsjukratrygginga' function/endpoint
      client[functionName](args, function (err: any, result: any) {
        if (err) {
          logger.error(JSON.stringify(err, null, 2))
          reject(err)
        } else {
          logger.info(
            `Successful call ${functionName} function and get result: ${JSON.stringify(
              result,
              null,
              2,
            )}`,
          )
          resolve(result)
        }
      })
    })
  }
}

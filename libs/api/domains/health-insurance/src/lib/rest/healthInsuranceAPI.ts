import { Injectable, NotFoundException } from '@nestjs/common'
import { logger } from '@island.is/logging'

import {
  DocumentApi,
  PersonApi,
  TestApi,
} from '@island.is/clients/health-insurance-v2'

@Injectable()
export class HealthInsuranceRESTAPI {
  constructor(
    private readonly restApi: DocumentApi,
    private readonly personApi: PersonApi,
    private readonly testApi: TestApi,
  ) {}

  public async getProfun(): Promise<string | null> {
    logger.info(`--- Starting getProfun api call ---`)
    const res = await this.testApi.testPing({})
    return res.numberIHI?.toString() ?? null
  }

  // check whether the person is health insured
  public async isHealthInsured(
    nationalId: string,
    date = Date.now(),
  ): Promise<boolean> {
    logger.info(`--- Starting isHealthInsured api call ---`)

    const args = {
      nationalID: nationalId,
      date: new Date(date),
    }

    return await this.personApi
      .personIsHealthInsured(args)
      .then((res) => {
        logger.info(`--- Finished isHealthInsured api call ---`)
        return res.isHealthInsured === 1
      })
      .catch((err) => {
        logger.error(
          `Something went totally wrong in 'Sjukratryggdur' call with result: ${JSON.stringify(
            err,
            null,
            2,
          )}`,
        )
        throw new NotFoundException(
          `Unexpected results: ${JSON.stringify(err)}`,
        )
      })
  }
}

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import {
  PassVerificationData,
  Result,
  VerifyInputData,
} from '../../../licenseClient.type'
import { BaseLicenseUpdateClient } from '../../baseLicenseUpdateClient'
import {
  Pass,
  PassDataInput,
  RevokePassData,
  SmartSolutionsService,
} from '@island.is/clients/smart-solutions-v2'

@Injectable()
export class DisabilityLicenseUpdateClient extends BaseLicenseUpdateClient {
  constructor(
    @Inject(LOGGER_PROVIDER) protected logger: Logger,
    protected smartApi: SmartSolutionsService,
  ) {
    super(logger, smartApi)
  }

  pushUpdate(
    inputData: PassDataInput,
    nationalId: string,
  ): Promise<Result<Partial<Pass> | undefined>> {
    return this.smartApi.updatePkPass(inputData, nationalId)
  }

  async pullUpdate(): Promise<Result<Partial<Pass>>> {
    return {
      ok: false,
      error: {
        code: 99,
        message: 'not implemented yet',
      },
    }
  }

  revoke(nationalId: string): Promise<Result<RevokePassData>> {
    throw new Error('Method not implemented.')
  }

  async verify(inputData: string): Promise<Result<PassVerificationData>> {
    let parsedInput
    try {
      parsedInput = JSON.parse(inputData) as VerifyInputData
    } catch (ex) {
      return {
        ok: false,
        error: {
          code: 12,
          message: 'Invalid input data',
        },
      }
    }

    const { code, date } = parsedInput

    if (!code || !date) {
      return {
        ok: false,
        error: {
          code: 4,
          message:
            'Invalid input data,  either code or date are missing or invalid',
        },
      }
    }

    const verifyRes = await this.smartApi.verifyPkPass({ code, date })

    if (!verifyRes.ok) {
      return verifyRes
    }

    return {
      ok: true,
      data: {
        valid: verifyRes.data.valid,
      },
    }
  }
}

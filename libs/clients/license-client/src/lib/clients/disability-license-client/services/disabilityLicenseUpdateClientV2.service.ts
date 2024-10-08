import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import {
  PassData,
  PassDataInput,
  PassRevocationData,
  PassVerificationData,
  Result,
  VerifyInputData,
} from '../../../licenseClient.type'
import { BaseLicenseUpdateClientV2 } from '../../base/licenseUpdateClientV2'
import { PkPassService } from '../../../helpers/pkPassService/pkPass.service'

@Injectable()
export class DisabilityLicenseUpdateClientV2 extends BaseLicenseUpdateClientV2 {
  constructor(
    @Inject(LOGGER_PROVIDER) protected logger: Logger,
    private readonly passService: PkPassService,
  ) {
    super()
  }

  pushUpdate(
    inputData: PassDataInput,
    nationalId: string,
  ): Promise<Result<PassData | undefined>> {
    return this.passService.updatePkPass(inputData, nationalId)
  }

  async pullUpdate(): Promise<Result<PassData>> {
    return {
      ok: false,
      error: {
        code: 99,
        message: 'not implemented yet',
      },
    }
  }

  revoke(nationalId: string): Promise<Result<PassRevocationData>> {
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

    const verifyRes = await this.passService.verifyPkPass({ code, date })

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

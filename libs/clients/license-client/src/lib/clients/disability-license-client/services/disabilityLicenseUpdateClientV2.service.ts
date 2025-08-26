import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import {
  PassData,
  PassDataInput,
  PassRevocationData,
  PassVerificationData,
  Result,
} from '../../../licenseClient.type'
import { BaseLicenseUpdateClientV2 } from '../../base/licenseUpdateClientV2'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'
import { VerifyInputDataDto } from '../../base/baseLicenseUpdateClient.types'
import { PkPassService } from '../../../helpers/pk-pass-service/pkPass.service'

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
    return this.passService.updatePkPass(inputData, nationalId, 'v2')
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

  async revoke(nationalId: string): Promise<Result<PassRevocationData>> {
    return {
      ok: false,
      error: {
        code: 99,
        message: 'not implemented yet',
      },
    }
  }

  async verify(inputData: string): Promise<Result<PassVerificationData>> {
    let parsedInput: VerifyInputDataDto
    try {
      parsedInput = plainToInstance(VerifyInputDataDto, JSON.parse(inputData))
      const errors = await validate(parsedInput)
      if (errors.length > 0) {
        return {
          ok: false,
          error: {
            code: 12,
            message: 'Invalid input data',
          },
        }
      }
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

    const verifyRes = await this.passService.verifyPkPass({ code, date }, 'v2')

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

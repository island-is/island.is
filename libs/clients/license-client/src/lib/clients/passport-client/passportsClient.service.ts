import { Inject, Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { LicenseClient, LicenseType, Result } from '../../licenseClient.type'
import { FetchError } from '@island.is/clients/middlewares'
import {
  IdentityDocument,
  IdentityDocumentChild,
  PassportsService,
} from '@island.is/clients/passports'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'
import { isDefined } from '@island.is/shared/utils'

@Injectable()
export class PassportsClient implements LicenseClient<LicenseType.Passport> {
  constructor(
    private passportService: PassportsService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  clientSupportsPkPass = false
  type = LicenseType.Passport

  async getLicenses(
    user: User,
  ): Promise<Result<Array<IdentityDocument | IdentityDocumentChild>>> {
    try {
      const { userPassports, childPassports } =
        await this.passportService.getAllIdentityDocuments(user)

      let passports: Array<IdentityDocument | IdentityDocumentChild> = [
        ...(userPassports || []),
      ].filter(isDefined)

      if (childPassports) {
        passports = [...passports, ...childPassports]
      }
      return {
        ok: true,
        data: passports.filter(isDefined),
      }
    } catch (e) {
      let error
      if (e instanceof FetchError) {
        //404 - no license for user, still ok!
        if (e.status === 404) {
          return {
            ok: true,
            data: [],
          }
        } else {
          error = {
            code: 13,
            message: 'Service failure',
            data: JSON.stringify(e.body),
          }
        }
      } else {
        const unknownError = e as Error
        error = {
          code: 99,
          message: 'Unknown error',
          data: JSON.stringify(unknownError),
        }
      }

      return {
        ok: false,
        error,
      }
    }
  }
}

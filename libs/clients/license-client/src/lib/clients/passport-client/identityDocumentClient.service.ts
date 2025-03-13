import { Inject, Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { LicenseClient, LicenseType, Result } from '../../licenseClient.type'
import { FetchError } from '@island.is/clients/middlewares'
import {
  IdentityDocument,
  PassportsService,
} from '@island.is/clients/passports'
import { LOGGER_PROVIDER, type Logger } from '@island.is/logging'

@Injectable()
export class IdentityDocumentClient
  implements LicenseClient<LicenseType.IdentityDocument>
{
  constructor(
    private passportService: PassportsService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  clientSupportsPkPass = false
  type = LicenseType.IdentityDocument

  async getLicenses(user: User): Promise<Result<Array<IdentityDocument>>> {
    try {
      const data = await this.passportService.getIdentityDocument(user, 'I')

      return {
        ok: true,
        data: data ?? [],
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

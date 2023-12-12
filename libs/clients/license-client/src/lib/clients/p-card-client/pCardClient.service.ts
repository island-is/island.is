import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { PCardService, Staediskortamal } from '@island.is/clients/p-card'
import { LicenseClient, Result } from '../../licenseClient.type'
import { FetchError } from '@island.is/clients/middlewares'

@Injectable()
export class PCardClient implements LicenseClient<Staediskortamal> {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private pCardService: PCardService,
  ) {}
  clientSupportsPkPass = false
  async getLicense(user: User): Promise<Result<Staediskortamal | null>> {
    try {
      const licenseInfo = await this.pCardService.getPCard(user)
      return { ok: true, data: licenseInfo }
    } catch (e) {
      let error
      if (e instanceof FetchError) {
        //404 - no license for user, still ok!
        if (e.status === 404) {
          return { ok: true, data: null }
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

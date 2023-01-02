import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { AdrApi, AdrDto } from '../..'
import { FetchResponse, Result } from '../api.types'
import type { Logger } from '@island.is/logging'
import { FetchError } from '@island.is/clients/middlewares'

const LOG_CATEGORY = 'adr-license-service'

@Injectable()
export class AdrLicenseService {
  constructor(private readonly logger: Logger, private readonly api: AdrApi) {}

  public async getLicenseInfo(user: User): Promise<Result<AdrDto | null>> {
    try {
      const licenseInfo: FetchResponse<AdrDto> = await this.api
        .withMiddleware(new AuthMiddleware(user as Auth))
        .getAdr()
      return { ok: true, data: licenseInfo }
    } catch (e) {
      //404 - no license for user, still ok!
      let error
      if (e instanceof FetchError) {
        //404 - no license for user, still ok!
        if (e.status === 404) {
          this.logger.debug('ADR license not found for user')
          return { ok: true, data: null }
        } else {
          error = {
            code: 13,
            message: 'Service failure',
            data: JSON.stringify(e.body),
          }
          this.logger.warn('Expected 200 or 404 status', {
            status: e.status,
            statusText: e.statusText,
            category: LOG_CATEGORY,
          })
        }
      } else {
        const unknownError = e as Error
        error = {
          code: 99,
          message: 'Unknown error',
          data: JSON.stringify(unknownError),
        }
        this.logger.warn('Unable to query data', {
          status: e.status,
          statusText: e.statusText,
          category: LOG_CATEGORY,
        })
      }

      return {
        ok: false,
        error,
      }
    }
  }
}

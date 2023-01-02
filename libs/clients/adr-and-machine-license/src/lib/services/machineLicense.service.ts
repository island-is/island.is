import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { VinnuvelaApi, VinnuvelaDto } from '../..'
import { FetchResponse, Result } from '../api.types'
import type { Logger } from '@island.is/logging'
import { FetchError } from '@island.is/clients/middlewares'

const LOG_CATEGORY = 'machine-license-service'
@Injectable()
export class MachineLicenseService {
  constructor(
    private readonly logger: Logger,
    private readonly api: VinnuvelaApi,
  ) {}

  public async getLicenseInfo(
    user: User,
  ): Promise<Result<VinnuvelaDto | null>> {
    try {
      const licenseInfo: FetchResponse<VinnuvelaDto> = await this.api
        .withMiddleware(new AuthMiddleware(user as Auth))
        .getVinnuvela()
      return { ok: true, data: licenseInfo }
    } catch (e) {
      //404 - no license for user, still ok!
      let error
      if (e instanceof FetchError) {
        //404 - no license for user, still ok!
        if (e.status === 404) {
          this.logger.debug('Machine license not found for user')
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

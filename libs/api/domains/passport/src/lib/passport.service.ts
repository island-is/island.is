import { Inject, Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { FetchError } from '@island.is/clients/middlewares'
import isBefore from 'date-fns/isBefore'
import differenceInMonths from 'date-fns/differenceInMonths'
import {
  IdentityDocumentApi,
  IdentityDocumentResponse,
} from '@island.is/clients/passports'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import type { Auth, User } from '@island.is/auth-nest-tools'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { IdentityDocumentModel } from './models/identityDocumentModel.model'

export type ExpiryStatus = 'EXPIRED' | 'LOST'
const LOG_CATEGORY = 'passport-service'

@Injectable()
export class PassportService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private passportsApi: IdentityDocumentApi,
  ) {}

  handleError(error: any, detail?: string): ApolloError | null {
    this.logger.error(detail || 'Domain passport error', {
      error: JSON.stringify(error),
      category: LOG_CATEGORY,
    })
    throw new ApolloError('Failed to resolve request', error.status)
  }

  private handle4xx(error: FetchError) {
    if (error.status === 403 || error.status === 404) {
      return undefined
    }
    this.handleError(error)
  }

  private getPassportsWithAuth(auth: Auth) {
    return this.passportsApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getIdentityDocument(
    auth: User,
  ): Promise<IdentityDocumentResponse[] | undefined> {
    try {
      const passportResponse = await this.getPassportsWithAuth(
        auth,
      ).identityDocumentGetIdentityDocument({
        personId: auth.nationalId,
      })

      const resArray = passportResponse.map((item) => {
        const { productionRequestID, ...passport } = item

        /**
         * Expiration status: string
         *    if invalid and expirationDate has passed: EXPIRED (ÚTRUNNIÐ)
         *    if invalid and expirationDate has NOT passed: LOST (GLATAÐ)
         *    else undefined
         */
        const invalidPassport = passport.status?.toLowerCase() === 'invalid'
        let expiryStatus: ExpiryStatus | undefined = undefined
        if (invalidPassport && passport.expirationDate) {
          const expirationDatePassed = isBefore(
            new Date(passport.expirationDate),
            new Date(),
          )

          const expired = invalidPassport && expirationDatePassed
          expiryStatus = expired ? 'EXPIRED' : 'LOST'
        }

        /**
         * Expires within notice time: boolean
         * Does the passport expire within 6 months or less from today
         */
        let expiresWithinNoticeTime = undefined
        if (passport.expirationDate) {
          expiresWithinNoticeTime =
            differenceInMonths(new Date(passport.expirationDate), new Date()) <
            7
        }

        /**
         * Passportnumber as displayed on icelandic passports.
         * With subtype in front.
         */
        const numberWithType = `${passport.subType ?? ''}${
          passport.number ?? ''
        }`

        return {
          ...passport,
          numberWithType,
          expiryStatus: expiryStatus,
          expiresWithinNoticeTime: expiresWithinNoticeTime,
        }
      }) as IdentityDocumentModel[]

      return resArray
    } catch (e) {
      this.handle4xx(e)
    }
  }
}

import { Inject, Injectable } from '@nestjs/common'
import { ApolloError } from 'apollo-server-express'
import { FetchError } from '@island.is/clients/middlewares'
// import { IdentityApi } from '@island.is/clients/passports'
// import { AuthMiddleware } from '@island.is/auth-nest-tools'
// import type { Auth, User } from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { IdentityDocumentModel } from './models/identityDocumentModel.model'

@Injectable()
export class PassportService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger, // private IdentityApi: IdentityApi,
  ) {}

  handleError(error: any): any {
    this.logger.error(error)

    throw new ApolloError(
      'Failed to resolve request',
      error?.message ?? error?.response?.message,
    )
  }

  private handle4xx(error: FetchError) {
    if (error.status === 403 || error.status === 404) {
      return undefined
    }
    this.handleError(error)
  }

  // private getIdentityWithAuth(auth: Auth) {
  //   return this.IdentityApi.withMiddleware(
  //     new AuthMiddleware(auth, { forwardUserInfo: true }),
  //   )
  // }

  async getIdentityDocument(
    auth: User,
  ): Promise<IdentityDocumentModel | undefined> {
    try {
      /**
       * TODO:
       * When the client is ready.
       *
       * Add custom values:
       *
       * expiryStatus: string
       *    if invalid and expirationDate has passed: EXPIRED (ÚTRUNNIÐ)
       *    if invalid and expirationDate has NOT passed: LOST (GLATAÐ)
       *    else undefined
       *
       * expiresWithinNoticeTime: boolean
       *    DATE_IN_6_MONTHS > expirationDate
       *    If the passport expires within 6 months we want to be able to show it in the UI
       */

      // const res = await this.getIdentityWithAuth(
      //   auth,
      // ).getIdentityDocument({
      //   kennitala: auth.nationalId,
      //   cursor: cursor,
      // })

      return undefined
    } catch (e) {
      this.handle4xx(e)
    }
  }
}

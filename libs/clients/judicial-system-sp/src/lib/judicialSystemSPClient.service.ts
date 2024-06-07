import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import {
  CaseControllerUpdateSubpoenaRequest,
  CasesApi,
  DefendersApi,
} from '../../gen/fetch'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Locale } from 'locale'

@Injectable()
export class JudicialSystemSPClientService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private casesApi: CasesApi,
    private defendersApi: DefendersApi,
  ) {}

  private casesApiWithAuth = (user: User) =>
    this.casesApi.withMiddleware(new AuthMiddleware(user as Auth))

  private defenderApiWithAuth = (user: User) =>
    this.defendersApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getCases(user: User, locale: Locale) {
    let cases
    try {
      cases = await this.casesApiWithAuth(user).caseControllerGetAllCases({
        lang: locale,
      })
    } catch (error) {
      this.logger.error('Failed getting cases for user', error)
    }
    return cases
  }

  async getCase(id: string, user: User, locale: Locale) {
    let singleCase
    try {
      singleCase = await this.casesApiWithAuth(user).caseControllerGetCase({
        caseId: id,
      })
    } catch (error) {
      this.logger.error('Failed getting single case for user', error)
    }

    return singleCase
  }

  async getLawyers(user: User, locale: Locale) {
    let lawyers
    try {
      lawyers = await this.defenderApiWithAuth(
        user,
      ).defenderControllerGetLawyers()
    } catch (error) {
      this.logger.warn('Failed getting lawyers list', error)
    }
    return lawyers
  }

  async getSubpoena(id: string, user: User, locale: Locale) {
    let subpoena
    try {
      subpoena = await this.casesApiWithAuth(user).caseControllerGetSubpoena({
        caseId: id,
      })
    } catch (error) {
      this.logger.warn('Failed getting subpoena for user', error)
    }
    return subpoena
  }

  async patchSubpoena(
    input: CaseControllerUpdateSubpoenaRequest,
    user: User,
    locale: Locale,
  ) {
    let response
    try {
      response = await this.casesApiWithAuth(user).caseControllerUpdateSubpoena(
        input,
      )
    } catch (error) {
      this.logger.error('Failed updating subpoena information')
    }
    return response
  }
}

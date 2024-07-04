import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import {
  CaseControllerGetAllCasesLocaleEnum,
  CaseControllerGetCaseLocaleEnum,
  CaseControllerGetSubpoenaLocaleEnum,
  CaseControllerUpdateSubpoenaRequest,
  CasesApi,
  DefendersApi,
} from '../../gen/fetch'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Locale } from 'locale'
import { handle404 } from '@island.is/clients/middlewares'

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
        locale: locale as CaseControllerGetAllCasesLocaleEnum,
      })
    } catch (error) {
      this.logger.error('Failed getting cases for user', error)
    }
    return cases
  }

  async getCase(id: string, user: User, locale: Locale) {
    return this.casesApiWithAuth(user)
      .caseControllerGetCase({
        caseId: id,
        locale: locale as CaseControllerGetCaseLocaleEnum,
      })
      .catch(handle404)
  }

  async getLawyers(user: User, locale: Locale) {
    return this.defenderApiWithAuth(user)
      .defenderControllerGetLawyers()
      .catch(handle404)
  }

  async getSubpoena(id: string, user: User, locale: Locale) {
    return this.casesApiWithAuth(user)
      .caseControllerGetSubpoena({
        caseId: id,
        locale: locale as CaseControllerGetSubpoenaLocaleEnum,
      })
      .catch(handle404)
  }

  async patchSubpoena(input: CaseControllerUpdateSubpoenaRequest, user: User) {
    return this.casesApiWithAuth(user)
      .caseControllerUpdateSubpoena(input)
      .catch(handle404)
  }
}

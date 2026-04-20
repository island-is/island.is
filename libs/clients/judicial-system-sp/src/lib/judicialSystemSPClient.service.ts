import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import {
  CaseControllerUpdateSubpoenaRequest,
  CasesApi,
  DefendersApi,
  UpdateVerdictAppealDecisionDtoVerdictAppealDecisionEnum,
} from '../../gen/fetch'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
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

  async getCases(user: User, locale: string) {
    return this.casesApiWithAuth(user)
      .caseControllerGetAllCases({
        locale: locale,
      })
      .catch(handle404)
  }

  async getCase(id: string, user: User, locale: string) {
    return this.casesApiWithAuth(user)
      .caseControllerGetCase({
        caseId: id,
        locale: locale,
      })
      .catch(handle404)
  }

  async getLawyers(user: User) {
    return this.defenderApiWithAuth(user)
      .defenderControllerGetLawyers()
      .catch(handle404)
  }

  async getSummon(id: string, user: User, locale: string) {
    return this.casesApiWithAuth(user)
      .caseControllerGetSubpoena({
        caseId: id,
        locale: locale,
      })
      .catch(handle404)
  }

  async getVerdict(id: string, user: User, locale: string) {
    return this.casesApiWithAuth(user)
      .caseControllerGetRuling({
        caseId: id,
        locale: locale,
      })
      .catch(handle404)
  }

  async patchVerdict(
    id: string,
    user: User,
    locale: string,
    choice: UpdateVerdictAppealDecisionDtoVerdictAppealDecisionEnum,
  ) {
    return this.casesApiWithAuth(user).caseControllerSubmitVerdictAppeal({
      caseId: id,
      locale: locale,
      updateVerdictAppealDecisionDto: {
        verdictAppealDecision: choice,
      },
    })
  }

  async patchSummon(input: CaseControllerUpdateSubpoenaRequest, user: User) {
    return this.casesApiWithAuth(user)
      .caseControllerUpdateSubpoena(input)
      .catch(handle404)
  }
}

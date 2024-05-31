import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { CasesApi, DefendersApi } from '../../gen/fetch'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'

@Injectable()
export class LawAndOrderClientService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private casesApi: CasesApi,
    private defendersApi: DefendersApi,
  ) {}

  private casesApiWithAuth = (user: User) =>
    this.casesApi.withMiddleware(new AuthMiddleware(user as Auth))

  private defenderApiWithAuth = (user: User) =>
    this.defendersApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getCases(user: User) {
    const ret = await this.casesApiWithAuth(user).caseControllerGetAllCases()
    return ret
  }

  async getLawyers(user: User) {
    const ret = await this.defenderApiWithAuth(
      user,
    ).defenderControllerGetLawyers()
    return ret
  }
}

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { LibraApi } from '../../gen/fetch'

export class HmsLoansClientService {
  constructor(private readonly loansApi: LibraApi) {}

  private apiWithAuth = (user: User) =>
    this.loansApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getHmsLoansLoanOverview(user: User) {
    return this.apiWithAuth(user).apiVversionLibraLanayfirlitPost({
      version: '1',
      kennitala: user.nationalId,
    })
  }

  async getHmsLoansPaymentOverview(user: User) {
    return this.apiWithAuth(user).apiVversionLibraGreidsluyfirlitPost({
      version: '1',
      kennitala: user.nationalId,
    })
  }
}

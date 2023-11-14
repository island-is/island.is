import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { LibraApi } from '../../gen/fetch'

@Injectable()
export class HmsLoansClientService {
  constructor(private readonly loansApi: LibraApi) {}

  private apiWithAuth = (user: User) =>
    this.loansApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getHmsLoansLoanOverview(user: User) {
    /* TODO: Will be implemented in v2 api soon
    return this.apiWithAuth(user).apiVversionLibraLanayfirlitPost({
      version: '2',
    })
    */
    return null
  }

  async getHmsLoansPaymentOverview(user: User) {
    return this.apiWithAuth(user).apiVversionLibraGreidsluyfirlitPost({
      version: '2',
    })
  }
}

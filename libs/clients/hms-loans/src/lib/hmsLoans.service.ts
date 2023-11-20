import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { LibraApi } from '../../gen/fetch'

@Injectable()
export class HmsLoansClientService {
  constructor(private readonly loansApi: LibraApi) {}

  private apiWithAuth = (user: User) =>
    this.loansApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getHmsLoansLoanhistory(user: User) {
    return this.apiWithAuth(user).apiVversionLibraLoanhistoryPost({
      version: '1',
    })
  }

  async getHmsLoansPaymenthistory(user: User) {
    return this.apiWithAuth(user).apiVversionLibraPaymenthistoryPost({
      version: '1',
    })
  }
}

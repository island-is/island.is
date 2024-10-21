import { User } from '@island.is/auth-nest-tools'
import { dataOr204Null } from '@island.is/clients/middlewares'
import { Injectable } from '@nestjs/common'
import {
  postApiVbyVersionLibraLoanhistory,
  postApiVbyVersionLibraLoanhistorypdf,
  postApiVbyVersionLibraPaymenthistorybyloanid,
} from '../../gen/fetch'

@Injectable()
export class HmsLoansClientService {
  async getHmsLoansHistory(user: User) {
    return dataOr204Null(
      postApiVbyVersionLibraLoanhistory({
        path: {
          version: '1',
        },
        auth: user,
      }),
    )
  }

  async getHmsLoansHistoryPdf(user: User) {
    return dataOr204Null(
      postApiVbyVersionLibraLoanhistorypdf({
        path: {
          version: '1',
        },
        auth: user,
      }),
    )
  }

  async getHmsLoansPaymentHistory(user: User, loanId: number) {
    return dataOr204Null(
      postApiVbyVersionLibraPaymenthistorybyloanid({
        path: {
          version: '1',
        },
        query: {
          loanId,
        },
        auth: user,
      }),
    )
  }
}

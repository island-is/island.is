import { Injectable } from '@nestjs/common'
import {
  ApiResponse,
  BankAccountDT,
  BankAccountsnationalIdGETResponse,
  BankAccountsnationalIdPOSTResponse,
  DefaultApi,
} from '../../gen/fetch'
import { handle404 } from '@island.is/clients/middlewares'

@Injectable()
export class BankinfoClientService {
  constructor(private api: DefaultApi) {}

  async getBankAccountsForNationalId(
    nationalId: string,
  ): Promise<BankAccountsnationalIdGETResponse | null> {
    return this.api
      .bankAccountsnationalIdGET1({
        nationalId,
      })
      .catch(handle404)
  }

  async createBankAccountForNationalId(
    nationalId: string,
    bankAccount: BankAccountDT,
  ): Promise<ApiResponse<BankAccountsnationalIdPOSTResponse> | null> {
    return this.api
      .bankAccountsnationalIdPOST1Raw({
        nationalId,
        bankAccount,
      })
      .catch(handle404)
  }
}

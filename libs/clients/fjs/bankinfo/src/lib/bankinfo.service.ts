import { Injectable } from '@nestjs/common'
import {
  BankAccountDT,
  BankAccountsnationalIdGETResponse, BankAccountsnationalIdvalidatePOSTResponse,BankAccountsnationalIdPOSTResponse,
  DefaultApi,
} from '../../gen/fetch'
import { handle404 } from '@island.is/clients/middlewares'

@Injectable()
export class BankinfoClientService {
  constructor(private api: DefaultApi) {}

  async getBankAccountsForNationalId(
    nationalId: string,
  ): Promise<BankAccountsnationalIdGETResponse | null> {
     return this.api.bankAccountsnationalIdGET1({
      nationalId,
    }).catch(handle404)

  }

  async createBankAccountForNationalId(
    nationalId: string,
    bankAccount: BankAccountDT,
  ): Promise<any> {
    console.log('Creating bank account', nationalId, bankAccount)
    return this.api.bankAccountsnationalIdPOST1Raw({
      nationalId,
      bankAccount,
    }).catch(e => {
      console.log('Error creating bank account', e)
      throw e
    })
  }

  async validateBankAccountForNationalId(
    nationalId: string,
    bankAccount: BankAccountDT,
  ): Promise<BankAccountsnationalIdvalidatePOSTResponse> {
    console.log('Validating bank account', nationalId, bankAccount)
    return this.api.bankAccountsnationalIdvalidatePOST2({
      nationalId,
      bankAccount,
    }).catch(e => {
      console.log('Error validating bank account', e)
      throw e
    })
  }
}

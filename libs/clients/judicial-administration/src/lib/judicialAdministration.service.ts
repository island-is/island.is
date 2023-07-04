import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import {
  AuthenticateApi,
  BankruptcyHistoryResult,
  SearchBankruptcyHistoryApi,
} from '../../gen/fetch'
import { JudicialAdministrationClientConfig } from './judicialAdministration.config'
import { Auth } from '@island.is/auth-nest-tools'

@Injectable()
export class JudicialAdministrationService {
  constructor(
    @Inject(JudicialAdministrationClientConfig.KEY)
    private clientConfig: ConfigType<typeof JudicialAdministrationClientConfig>,
    private readonly authenticateApi: AuthenticateApi,
    private readonly searchBankruptcyApi: SearchBankruptcyHistoryApi,
  ) {}

  private async getAuthenticationToken(): Promise<string> {
    const authenticationToken = await this.authenticateApi.authenticateUser({
      credentials: {
        userName: this.clientConfig.username,
        password: this.clientConfig.password,
      },
    })
    //  The client returns the string with extra quotations
    // so we remove them before returning the object
    return authenticationToken.replace(/['"]+/g, '')
  }

  public async searchBankruptcy(
    auth: Auth,
  ): Promise<BankruptcyHistoryResult[]> {
    const authenticationToken = await this.getAuthenticationToken()
    const cert = await this.searchBankruptcyApi.searchBankruptcyHistory({
      authenticationToken,
      idNumber: auth.nationalId ?? '',
    })
    return cert
  }
}

import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import {
  AuthenticateApi,
  BankruptcyHistoryResult,
  SearchBankruptcyHistoryApi,
} from '../../gen/fetch'
import { CourtBankruptcyCertClientConfig } from './courtBankruptcyCert.config'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'

@Injectable()
export class CourtBankruptcyCertService {
  constructor(
    @Inject(CourtBankruptcyCertClientConfig.KEY)
    private clientConfig: ConfigType<typeof CourtBankruptcyCertClientConfig>,
    private readonly authenticateApi: AuthenticateApi,
    private readonly searchBankruptcyApi: SearchBankruptcyHistoryApi,
  ) {}

  private async getAuthenticationToken(): Promise<string> {
    const authenticationToken =  await  this.authenticateApi
      .authenticateUser({
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
    const cert = await this.searchBankruptcyApi
      .withMiddleware(new AuthMiddleware(auth))
      .searchBankruptcyHistory({
        authenticationToken,
        idNumber: auth.nationalId ?? '',
      })
    return cert
  }
}

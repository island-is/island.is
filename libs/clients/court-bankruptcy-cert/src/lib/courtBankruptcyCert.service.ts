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

  private async getAuthenticationToken(auth: Auth): Promise<string> {
    return this.authenticateApi
      .withMiddleware(new AuthMiddleware(auth))
      .authenticateUser({
        credentials: {
          username: this.clientConfig.username,
          password: this.clientConfig.password,
        },
      })
  }

  public async searchBankruptcy(
    auth: Auth,
  ): Promise<BankruptcyHistoryResult[]> {
    // const authenticationToken = await this.getAuthenticationToken(auth)
    const cert = await this.searchBankruptcyApi
      .withMiddleware(new AuthMiddleware(auth))
      .searchBankruptcyHistory({
        authenticationToken: 'b20e34aa-c4e0-4bff-aa7d-6b3e7035224b',
        idNumber: auth.nationalId ?? '',
      })
    console.log('CERT', JSON.stringify(cert))
    return cert
  }
}

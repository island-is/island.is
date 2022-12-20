import { Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import {
  AuthenticateApi,
  BankruptcyHistoryResult,
  SearchBankruptcyHistoryApi,
} from '../../gen/fetch'
import { CourtBankruptcyCertClientConfig } from './courtBankruptcyCert.config'

@Injectable()
export class CourtBankruptcyCertService {
  constructor(
    @Inject(CourtBankruptcyCertClientConfig.KEY)
    private clientConfig: ConfigType<typeof CourtBankruptcyCertClientConfig>,
    private readonly authenticateApi: AuthenticateApi,
    private readonly searchBankruptcyApi: SearchBankruptcyHistoryApi,
  ) {}

  private async getAuthenticationToken(): Promise<string> {
    return this.authenticateApi.authenticate({
      username: this.clientConfig.username,
      password: this.clientConfig.password,
    })
  }

  public async searchBankruptcy(
    idNumber: string,
  ): Promise<BankruptcyHistoryResult[]> {
    const authenticationToken = await this.getAuthenticationToken()
    return this.searchBankruptcyApi.searchBankruptcyHistory({
      authenticationToken,
      idNumber,
    })
  }
}

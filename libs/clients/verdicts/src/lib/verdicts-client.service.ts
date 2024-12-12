import { Inject, Injectable } from '@nestjs/common'

import {
  GetVerdictsOperationRequest,
  SecurityApi,
  VerdictApi,
} from '../../gen/fetch/apis/'
import { VerdictsClientConfig } from './verdicts-client.config'
import { ConfigType } from '@nestjs/config'

@Injectable()
export class VerdictsClientService {
  constructor(
    @Inject(VerdictsClientConfig.KEY)
    private readonly clientConfig: ConfigType<typeof VerdictsClientConfig>,
    private readonly securityApi: SecurityApi,
    private readonly verdictApi: VerdictApi,
  ) {}

  // TODO: Don't authenticate on every request, reuse token and refresh if it expires
  private async getAuthenticationToken() {
    return this.securityApi.authenticate({
      username: this.clientConfig.goproUsername,
      password: this.clientConfig.goproPassword,
    })
  }

  async getVerdicts(input: GetVerdictsOperationRequest['requestData']) {
    const token = await this.getAuthenticationToken()
    return this.verdictApi.getVerdicts({
      requestData: input,
      token,
    })
  }

  async getSingleVerdictById(id: string) {
    const token = await this.getAuthenticationToken()
    return this.verdictApi.getVerdict({
      id,
      token,
    })
  }
}

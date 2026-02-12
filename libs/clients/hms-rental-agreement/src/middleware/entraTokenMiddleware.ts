import { Configuration, ConfidentialClientApplication } from '@azure/msal-node'
import { FetchAPI } from '../../gen/fetch'
import { ConfigType } from '@nestjs/config'
import { HmsRentalAgreementClientConfig } from '../hmsRentalAgreement.config'

interface RequestContext {
  fetch: FetchAPI
  url: string
  init: RequestInit
}

export class EntraTokenMiddleware {
  constructor(
    private config: ConfigType<typeof HmsRentalAgreementClientConfig>,
  ) {}

  async pre(context: RequestContext) {
    const msalConfig: Configuration = {
      auth: {
        clientId: this.config.authClientId,
        clientSecret: this.config.authClientSecret,
        authority: `https://login.microsoftonline.com/${this.config.authTenantId}`,
      },
    }

    const clientApplication = new ConfidentialClientApplication(msalConfig)

    const tokenResponse =
      await clientApplication.acquireTokenByClientCredential({
        scopes: [`api://${this.config.authClientId}/.default`],
      })

    if (!tokenResponse?.accessToken) {
      throw new Error('Failed to acquire entra token for rental agreements')
    }

    context.init.headers = Object.assign({}, context.init.headers, {
      'X-User-Authorization': `Bearer ${tokenResponse?.accessToken}`,
    })
  }
}

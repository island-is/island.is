import { Inject, Injectable } from '@nestjs/common'
import { AppointmentAPIApi, Configuration } from '../../gen/fetch'
import { HeilbrigdisstofnunNordurlandsClientConfig } from './heilbrigdisstofnunNordurlandsClient.config'
import type { ConfigType } from '@island.is/nest/config'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { AuthHeaderMiddleware } from '@island.is/auth-nest-tools'

@Injectable()
export class HeilbrigdisstofnunNordurlandsClientService {
  constructor(
    @Inject(HeilbrigdisstofnunNordurlandsClientConfig.KEY)
    private clientConfig: ConfigType<
      typeof HeilbrigdisstofnunNordurlandsClientConfig
    >,
  ) {}

  private async createApi() {
    const api = new AppointmentAPIApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-heilbrigdisstofnun-nordurlands',
          ...this.clientConfig.fetch,
        }),
        basePath: this.clientConfig.url,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }),
    )

    const accessToken = await api.apiV1AuthLoginPost({
      loginRequest: { apiKey: this.clientConfig.apiKey },
    })

    if (!accessToken) {
      throw new Error(
        'Heilbrigdisstofnun Nordurlands client configuration and login went wrong',
      )
    }

    return api.withMiddleware(new AuthHeaderMiddleware(`Bearer ${accessToken}`))
  }

  async getResources(personSsn: string) {
    const api = await this.createApi()
    const resources = await api.apiV1ResourcesGet({ personSsn })
    return resources
  }
}

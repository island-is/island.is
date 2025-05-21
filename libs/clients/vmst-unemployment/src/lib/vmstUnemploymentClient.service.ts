import {
  AuthApi,
  Configuration,
  UnemploymentApplicationApi,
} from '../../gen/fetch'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { XRoadConfig } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'
import { Injectable, Inject } from '@nestjs/common'
import { AuthHeaderMiddleware, User } from '@island.is/auth-nest-tools'
import { VmstUnemploymentClientConfig } from './vmstUnemploymentClient.config'

@Injectable()
export class VmstUnemploymentClientService {
  constructor(
    @Inject(VmstUnemploymentClientConfig.KEY)
    private clientConfig: ConfigType<typeof VmstUnemploymentClientConfig>,
    @Inject(XRoadConfig.KEY)
    private xroadConfig: ConfigType<typeof XRoadConfig>,
  ) {}

  async create() {
    const authApi = new AuthApi(
      new Configuration({
        fetchApi: createEnhancedFetch({
          name: 'clients-vmst-unemployment-auth',
          // ...this.clientConfig.fetch,
        }),
        basePath: `${this.xroadConfig.xRoadBasePath}/r1/${this.clientConfig.xRoadServicePath}`,
        headers: {
          'X-Road-Client': this.xroadConfig.xRoadClient,
        },
      }),
    )
    const config = {
      userName: this.clientConfig.username,
      password: this.clientConfig.password,
    }
    const { authToken } = await authApi.authLogin({
      galdurXRoadAPIViewModelsCredentialsViewModel: config,
    })
    if (authToken) {
      const api = new UnemploymentApplicationApi(
        new Configuration({
          fetchApi: createEnhancedFetch({
            name: 'clients-vmst-unemployment',
            // ...this.clientConfig.fetch,
          }),
          basePath: `${this.xroadConfig.xRoadBasePath}/r1/${this.clientConfig.xRoadServicePath}`,
          headers: {
            'X-Road-Client': this.xroadConfig.xRoadClient,
          },
        }),
      )
      return api.withMiddleware(new AuthHeaderMiddleware(`Bearer ${authToken}`))
    } else {
      throw new Error(
        'VMST unemployment client configuration and login went wrong',
      )
    }
  }

  async getEmptyApplication(): Promise<any> {
    const api = await this.create()

    const response =
      await api.unemploymentApplicationGetEmptyUnemploymentApplication()
    return response
  }
}

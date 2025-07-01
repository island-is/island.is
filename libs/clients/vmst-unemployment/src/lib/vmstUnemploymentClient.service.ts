import {
  ActivationGrantApi,
  AuthApi,
  Configuration,
  GaldurDomainModelsApplicationsUnemploymentApplicationsQueriesUnemploymentApplicationViewModel,
  UnemploymentApplicationApi,
} from '../../gen/fetch'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { XRoadConfig } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'
import { Injectable, Inject } from '@nestjs/common'
import { AuthHeaderMiddleware, User } from '@island.is/auth-nest-tools'
import { VmstUnemploymentClientConfig } from './vmstUnemploymentClient.config'

type ApiConstructor<T> = new (config: Configuration) => T

type VmstApis = UnemploymentApplicationApi | ActivationGrantApi

@Injectable()
export class VmstUnemploymentClientService {
  constructor(
    @Inject(VmstUnemploymentClientConfig.KEY)
    private clientConfig: ConfigType<typeof VmstUnemploymentClientConfig>,
    @Inject(XRoadConfig.KEY)
    private xroadConfig: ConfigType<typeof XRoadConfig>,
  ) {}

  async createApiClient<T extends VmstApis>(
    ApiClass: ApiConstructor<T>,
    fetchName: string,
    errorMessage: string,
  ): Promise<T> {
    const authApi = new AuthApi(
      new Configuration({
        fetchApi: createEnhancedFetch({ name: `${fetchName}-auth` }),
        basePath: `${this.xroadConfig.xRoadBasePath}/r1/${this.clientConfig.xRoadServicePath}`,
        headers: { 'X-Road-Client': this.xroadConfig.xRoadClient },
      }),
    )

    const { authToken } = await authApi.authLogin({
      galdurXRoadAPIViewModelsCredentialsViewModel: {
        userName: this.clientConfig.username,
        password: this.clientConfig.password,
      },
    })

    if (!authToken) {
      throw new Error(errorMessage)
    }

    const api = new ApiClass(
      new Configuration({
        fetchApi: createEnhancedFetch({ name: fetchName }),
        basePath: `${this.xroadConfig.xRoadBasePath}/r1/${this.clientConfig.xRoadServicePath}`,
        headers: { 'X-Road-Client': this.xroadConfig.xRoadClient },
      }),
    )

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const withAuth = (api as any).withMiddleware?.(
      new AuthHeaderMiddleware(`Bearer ${authToken}`),
    )

    return (withAuth ?? api) as T
  }

  async getEmptyApplication(
    auth: User,
  ): Promise<GaldurDomainModelsApplicationsUnemploymentApplicationsQueriesUnemploymentApplicationViewModel> {
    const api = await this.createApiClient(
      UnemploymentApplicationApi,
      'clients-vmst-unemployment',
      'Unemployment API auth failed',
    )

    const response =
      await api.unemploymentApplicationGetEmptyUnemploymentApplicationWithProfile(
        { applicantSSN: auth.nationalId },
      )
    return response
  }

  async getEmptyActivityGrantApplication(
    auth: User,
  ): Promise<GaldurDomainModelsApplicationsUnemploymentApplicationsQueriesUnemploymentApplicationViewModel> {
    const api = await this.createApiClient(
      ActivationGrantApi,
      'clients-vmst-unemployment',
      'Activation Grant API auth failed',
    )

    const response =
      await api.activationGrantGetEmptyActivationGrantWithProfile({
        applicantSSN: auth.nationalId,
      })
    return response
  }
}

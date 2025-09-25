import {
  ActivationGrantApi,
  ActivationGrantCreateActivationGrantRequest,
  ActivationGrantValidateBankInformationRequest,
  AttachmentApi,
  AttachmentCreateAttachmentRequest,
  AuthApi,
  Configuration,
  GaldurDomainModelsApplicationsActivationGrantApplicationsViewModelsActivationGrantViewModel,
  GaldurDomainModelsApplicationsUnemploymentApplicationsQueriesUnemploymentApplicationViewModel,
  GaldurDomainModelsAttachmentsAttachmentViewModel,
  UnemploymentApplicationApi,
} from '../../gen/fetch'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { XRoadConfig } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'
import { Injectable, Inject } from '@nestjs/common'
import { AuthHeaderMiddleware, User } from '@island.is/auth-nest-tools'
import { VmstUnemploymentClientConfig } from './vmstUnemploymentClient.config'

type ApiConstructor<T> = new (config: Configuration) => T

type VmstApis = UnemploymentApplicationApi | ActivationGrantApi | AttachmentApi

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

  async getEmptyActivationGrantApplication(
    auth: User,
  ): Promise<GaldurDomainModelsApplicationsActivationGrantApplicationsViewModelsActivationGrantViewModel> {
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

  async createAttachmentForActivationGrant(
    requestParameter: AttachmentCreateAttachmentRequest,
  ): Promise<GaldurDomainModelsAttachmentsAttachmentViewModel> {
    const api = await this.createApiClient(
      AttachmentApi,
      'clients-vmst-unemployment',
      'Activation Grant API auth failed',
    )

    const response = await api.attachmentCreateAttachment(requestParameter)

    return response
  }

  async submitActivationGrantApplication(
    requestParameter: ActivationGrantCreateActivationGrantRequest,
  ): Promise<GaldurDomainModelsApplicationsActivationGrantApplicationsViewModelsActivationGrantViewModel> {
    const api = await this.createApiClient(
      ActivationGrantApi,
      'clients-vmst-unemployment',
      'Activation Grant API auth failed',
    )

    const response = await api.activationGrantCreateActivationGrant(
      requestParameter,
    )
    return response
  }

  async validateBankInfo(
    requestParameter: ActivationGrantValidateBankInformationRequest,
  ): Promise<boolean> {
    const api = await this.createApiClient(
      ActivationGrantApi,
      'clients-vmst-unemployment',
      'Activation Grant API auth failed',
    )

    const response = await api.activationGrantValidateBankInformation(
      requestParameter,
    )
    // OpenApi codegen does not seem to handle pure primitive values (i.e not in an object)
    // So the generated code transforms this bool into text, I change it back here
    return (response as unknown) === 'true' || response === true
  }
}

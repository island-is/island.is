import {
  ActivationGrantApi,
  ActivationGrantCreateActivationGrantRequest,
  ActivationGrantValidateBankInformationRequest,
  ApplicantApi,
  ApplicationApi,
  AttachmentApi,
  AttachmentCreateAttachmentRequest,
  AuthApi,
  Configuration,
  GaldurDomainModelsApplicationsActivationGrantApplicationsViewModelsActivationGrantViewModel,
  GaldurDomainModelsApplicationsUnemploymentApplicationsQueriesUnemploymentApplicationViewModel,
  UnemploymentApplicationCreateUnemploymentApplicationRequest,
  GaldurDomainModelsAttachmentsAttachmentViewModel,
  UnemploymentApplicationApi,
  UnemploymentApplicationValidatePaymentPageRequest,
  GaldurDomainModelsApplicationsUnemploymentApplicationsUnemploymentApplicationValidationResponseDTO,
  UnemploymentApplicationValidatePaymentPage2Request,
  GaldurXRoadAPIModelsUnemploymentApplicationOverviewResponse,
  GaldurXRoadAPIModelsApplicationApplicationOverviewItem,
  GaldurXRoadAPIModelsApplicantApplicantOverviewResponse,
  ApplicantInfoApi,
  GaldurXRoadAPIModelsApplicantInfoResponse,
  GaldurXRoadAPIModelsApplicantInfoSupportDataResponse,
  UnemploymentApplicationWithdrawApplicationRequest,
  SupportDataApi,
  GaldurExternalDomainModelsSupportDataDelistingReasonDTO,
  GaldurExternalDomainRequestsWithdrawOverviewResponse,
  GaldurExternalDomainRequestsApplicantCreateForeignStayRequest,
  GaldurExternalDomainModelsAttachmentAttachmentRequestDTO,
  GaldurExternalDomainModelsAttachmentAttachmentDTO,
  GaldurExternalDomainModelsAttachmentAttachmentListItem,
  GaldurXRoadAPIModelsAvailableActions,
  ApplicantUpdateApplicantRequest,
  ApplicantGetApplicantInfoRequest,
  GaldurXRoadAPIModelsJobSearchConfirmationCreateJobSearchConfirmationRequest,
  GaldurXRoadAPIModelsJobSearchConfirmationJobSearchConfirmationEligibilityResponse,
  ApplicantCreateApplicantRequestedAttachmentRequest,
  GaldurXRoadAPIModelsApplicantForeignTravelEligibilityResponse,
  GaldurXRoadAPIModelsApplicantCreateAttachmentEligibilityResponse,
  GaldurDomainModelsBaseViewModel,
  IncomeApi,
  IncomeCreateIrregularJobRequest,
  IncomeCreatePartTimeJobRequest,
  IncomeCreateCapitalIncomePaymentRequest,
  IncomeCreateTRPaymentRequest,
  IncomeCreatePensionPaymentRequest,
  GaldurExternalDomainModelsIncomeIrregularJobDTO,
  GaldurExternalDomainModelsIncomePartTimeJobDTO,
  GaldurExternalDomainModelsIncomeCapitalIncomePaymentDTO,
  GaldurExternalDomainModelsIncomeTRPaymentDTO,
  GaldurExternalDomainModelsIncomePensionPaymentDTO,
  GaldurExternalDomainModelsIncomeContractorJobDTO,
  IncomeSupportDataApi,
  GaldurExternalDomainModelsIncomeIncomeTypeDTO,
  UncompensatedPeriodsApi,
  UncompensatedPeriodsCreateContractorJobRequest,
  PensionFundsApi,
  GaldurExternalDomainModelsPensionFundPensionFundItemDTO,
} from '../../gen/fetch'
import { createEnhancedFetch } from '@island.is/clients/middlewares'
import { XRoadConfig } from '@island.is/nest/config'
import type { ConfigType } from '@island.is/nest/config'
import { Injectable, Inject } from '@nestjs/common'
import { AuthHeaderMiddleware, User } from '@island.is/auth-nest-tools'
import { VmstUnemploymentClientConfig } from './vmstUnemploymentClient.config'
import { Locale } from '@island.is/shared/types'
import {
  VmstApplicationStatus,
  resolveApplicationStatus,
} from './vmstApplicationStatus'

type ApiConstructor<T> = new (config: Configuration) => T

type VmstApis =
  | UnemploymentApplicationApi
  | ActivationGrantApi
  | AttachmentApi
  | ApplicantInfoApi
  | ApplicantApi
  | ApplicationApi
  | SupportDataApi
  | IncomeApi
  | IncomeSupportDataApi
  | UncompensatedPeriodsApi
  | PensionFundsApi

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
      throw new Error(
        `Creating ${ApiClass.name} client failed, no auth token returned`,
      )
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
    )

    const response =
      await api.activationGrantGetEmptyActivationGrantWithProfile({
        applicantSSN: auth.nationalId,
      })
    return response
  }

  async getAttachmentTypes() {
    const api = await this.createApiClient(
      AttachmentApi,
      'clients-vmst-unemployment',
    )
    return await api.attachmentAttachmentTypes({ onlyVisible: false })
  }

  async createAttachmentForApplication(
    requestParameter: AttachmentCreateAttachmentRequest,
  ): Promise<GaldurDomainModelsAttachmentsAttachmentViewModel> {
    const api = await this.createApiClient(
      AttachmentApi,
      'clients-vmst-unemployment',
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
    )

    const response = await api.activationGrantValidateBankInformation(
      requestParameter,
    )
    // OpenApi codegen does not seem to handle pure primitive values (i.e not in an object)
    // So the generated code transforms this bool into text, I change it back here
    return (response as unknown) === 'true' || response === true
  }

  async validateBankInfoUnemploymentApplication(
    requestParameter: UnemploymentApplicationValidatePaymentPageRequest,
  ): Promise<GaldurDomainModelsApplicationsUnemploymentApplicationsUnemploymentApplicationValidationResponseDTO> {
    const api = await this.createApiClient(
      UnemploymentApplicationApi,
      'clients-vmst-unemployment',
    )

    return await api.unemploymentApplicationValidatePaymentPage(
      requestParameter,
    )
  }

  async canUserWithdrawUnemploymentApplication(
    applicantId: string,
  ): Promise<GaldurExternalDomainRequestsWithdrawOverviewResponse> {
    const api = await this.createApiClient(
      ApplicantApi,
      'clients-vmst-unemployment',
    )

    return await api.applicantGetUnemploymentApplicationsWithdrawOverview({
      id: applicantId,
    })
  }

  async withdrawApplicationSupportData(): Promise<
    Array<GaldurExternalDomainModelsSupportDataDelistingReasonDTO>
  > {
    const api = await this.createApiClient(
      SupportDataApi,
      'clients-vmst-unemployment',
    )

    return await api.supportDataGetDelistingReasons()
  }

  async withdrawUnemploymentApplication(
    requestParameter: UnemploymentApplicationWithdrawApplicationRequest,
  ): Promise<GaldurDomainModelsBaseViewModel> {
    const api = await this.createApiClient(
      UnemploymentApplicationApi,
      'clients-vmst-unemployment',
    )

    return await api.unemploymentApplicationWithdrawApplication(
      requestParameter,
    )
  }

  async validateVacationInfoUnemploymentApplication(
    requestParameter: UnemploymentApplicationValidatePaymentPage2Request,
  ): Promise<GaldurDomainModelsApplicationsUnemploymentApplicationsUnemploymentApplicationValidationResponseDTO> {
    const api = await this.createApiClient(
      UnemploymentApplicationApi,
      'clients-vmst-unemployment',
    )

    return await api.unemploymentApplicationValidatePaymentPage2(
      requestParameter,
    )
  }

  /* 
  Fetches application information for the overview page on My Pages island.is
  */
  async getApplicationOverview(
    auth: User,
    language?: Locale,
  ): Promise<
    GaldurXRoadAPIModelsUnemploymentApplicationOverviewResponse & {
      applicationStatus: VmstApplicationStatus
    }
  > {
    const api = await this.createApiClient(
      UnemploymentApplicationApi,
      'clients-vmst-unemployment',
    )

    const lang = language ? language.toUpperCase() : null

    const response =
      await api.unemploymentApplicationGetLatestUnemploymentApplicationOverview(
        { ssn: auth.nationalId, language: lang },
      )

    return {
      ...response,
      applicationStatus: resolveApplicationStatus(response.applicationStatusId),
    }
  }

  async submitApplication(
    request: UnemploymentApplicationCreateUnemploymentApplicationRequest,
  ): Promise<GaldurDomainModelsApplicationsUnemploymentApplicationsQueriesUnemploymentApplicationViewModel> {
    const api = await this.createApiClient(
      UnemploymentApplicationApi,
      'clients-vmst-unemployment',
    )
    return await api.unemploymentApplicationCreateUnemploymentApplication(
      request,
    )
  }

  async resolveApplicant(auth: User): Promise<{ applicantId: string }> {
    const api = await this.createApiClient(
      ApplicantApi,
      'clients-vmst-unemployment',
    )

    const response = await api.applicantResolve({
      galdurXRoadAPIModelsResolveApplicantRequest: {
        ssn: auth.nationalId,
      },
    })

    if (!response?.applicantId) {
      throw new Error('Failed to fetch applicant Id')
    }
    return { applicantId: response.applicantId }
  }

  /**
   * Returns overview of applications that should be shown for an applicant.
   */
  async getApplicationsOverview(applicantId: string, language?: Locale) {
    const api = await this.createApiClient(
      ApplicationApi,
      'clients-vmst-unemployment',
    )

    const lang = language ? language.toUpperCase() : null

    const response = await api.applicationOverview({
      galdurXRoadAPIModelsApplicationGetApplicationsOverviewRequest: {
        applicantId,
        language: lang,
      },
    })

    const enrichItem = (
      item?: GaldurXRoadAPIModelsApplicationApplicationOverviewItem | null,
    ) =>
      item ? { ...item, status: resolveApplicationStatus(item.statusId) } : item

    return {
      ...response,
      unemploymentApplication: enrichItem(response.unemploymentApplication),
      activationGrant: enrichItem(response.activationGrant),
    }
  }

  /*
    Return an overview of users information for My Pages.
  */
  async getApplicantOverview(
    applicantId: string,
    language?: Locale,
  ): Promise<GaldurXRoadAPIModelsApplicantApplicantOverviewResponse> {
    const api = await this.createApiClient(
      ApplicantApi,
      'clients-vmst-unemployment',
    )

    const lang = language ? language.toUpperCase() : null

    return await api.applicantOverview({
      id: applicantId,
      language: lang,
    })
  }

  /*
    Return all missing a submitted documents for a users application
  */
  async getApplicantRequestedAttachments(
    applicantId: string,
  ): Promise<Array<GaldurExternalDomainModelsAttachmentAttachmentRequestDTO>> {
    const api = await this.createApiClient(
      ApplicantApi,
      'clients-vmst-unemployment',
    )

    return await api.applicantGetApplicantRequestedAttachments({
      applicantId,
    })
  }

  /*
    Returns which actions a user can take on My Pages depending on application status.
  */
  async getApplicantActions(
    applicantId: string,
  ): Promise<GaldurXRoadAPIModelsAvailableActions> {
    const api = await this.createApiClient(
      ApplicantApi,
      'clients-vmst-unemployment',
    )

    return await api.applicantGetActions({
      id: applicantId,
    })
  }

  async getApplicantAttachments(
    applicantId: string,
  ): Promise<Array<GaldurExternalDomainModelsAttachmentAttachmentListItem>> {
    const api = await this.createApiClient(
      ApplicantApi,
      'clients-vmst-unemployment',
    )

    return await api.applicantGetApplicantAttachments({
      applicantId,
    })
  }

  async submitJobSearchConfirmation(
    auth: User,
    request: GaldurXRoadAPIModelsJobSearchConfirmationCreateJobSearchConfirmationRequest,
  ): Promise<void> {
    const { applicantId } = await this.resolveApplicant(auth)

    if (!applicantId) {
      throw new Error('Failed to resolve applicantId')
    }

    const api = await this.createApiClient(
      ApplicantApi,
      'clients-vmst-unemployment',
    )
    await api.applicantCreateJobSearchConfirmations({
      id: applicantId,
      galdurXRoadAPIModelsJobSearchConfirmationCreateJobSearchConfirmationRequest:
        request,
    })
  }

  async checkJobSearchConfirmationEligibility(
    auth: User,
  ): Promise<GaldurXRoadAPIModelsJobSearchConfirmationJobSearchConfirmationEligibilityResponse> {
    const { applicantId } = await this.resolveApplicant(auth)

    if (!applicantId) {
      throw new Error('Failed to resolve applicantId')
    }

    const api = await this.createApiClient(
      ApplicantApi,
      'clients-vmst-unemployment',
    )

    return await api.applicantGetJobSearchConfirmationEligibility({
      id: applicantId,
    })
  }

  async checkConfirmTravelEligibility(
    auth: User,
  ): Promise<GaldurXRoadAPIModelsApplicantForeignTravelEligibilityResponse> {
    const { applicantId } = await this.resolveApplicant(auth)

    if (!applicantId) {
      throw new Error('Failed to resolve applicantId')
    }

    const api = await this.createApiClient(
      ApplicantApi,
      'clients-vmst-unemployment',
    )

    return await api.applicantGetForeignTravelEligibility({
      id: applicantId,
    })
  }

  async checkCreateAttachmentEligibility(auth: User): Promise<
    GaldurXRoadAPIModelsApplicantCreateAttachmentEligibilityResponse & {
      applicantId: string
    }
  > {
    const { applicantId } = await this.resolveApplicant(auth)

    if (!applicantId) {
      throw new Error('Failed to resolve applicantId')
    }

    const api = await this.createApiClient(
      ApplicantApi,
      'clients-vmst-unemployment',
    )

    const result = await api.applicantGetCreateAttachmentEligibility({
      id: applicantId,
    })

    return { ...result, applicantId }
  }

  async submitTravelConfirmation(
    auth: User,
    request: GaldurExternalDomainRequestsApplicantCreateForeignStayRequest,
  ): Promise<void> {
    const { applicantId } = await this.resolveApplicant(auth)

    if (!applicantId) {
      throw new Error('Failed to resolve applicantId')
    }

    const api = await this.createApiClient(
      ApplicantApi,
      'clients-vmst-unemployment',
    )
    await api.applicantCreateForeignTravel({
      id: applicantId,
      galdurExternalDomainRequestsApplicantCreateForeignStayRequest: request,
    })
  }

  async getCurrentApplicationForActions(
    requestParameters: ApplicantGetApplicantInfoRequest,
  ): Promise<GaldurXRoadAPIModelsApplicantInfoResponse> {
    const api = await this.createApiClient(
      ApplicantApi,
      'clients-vmst-unemployment',
    )
    return await api.applicantGetApplicantInfo(requestParameters)
  }

  async getCurrentApplicationSupportDataForActions(): Promise<GaldurXRoadAPIModelsApplicantInfoSupportDataResponse> {
    const api = await this.createApiClient(
      ApplicantApi,
      'clients-vmst-unemployment',
    )
    return await api.applicantGetApplicantInfoSupportData()
  }

  async updateCurrentApplicationForActions(
    requestParameters: ApplicantUpdateApplicantRequest,
  ): Promise<GaldurXRoadAPIModelsApplicantInfoResponse> {
    const api = await this.createApiClient(
      ApplicantApi,
      'clients-vmst-unemployment',
    )
    return await api.applicantUpdateApplicant(requestParameters)
  }

  async createIrregularJob(
    requestParameters: IncomeCreateIrregularJobRequest,
  ): Promise<GaldurExternalDomainModelsIncomeIrregularJobDTO> {
    const api = await this.createApiClient(
      IncomeApi,
      'clients-vmst-unemployment',
    )
    return await api.incomeCreateIrregularJob(requestParameters)
  }

  async createPartTimeJob(
    requestParameters: IncomeCreatePartTimeJobRequest,
  ): Promise<GaldurExternalDomainModelsIncomePartTimeJobDTO> {
    const api = await this.createApiClient(
      IncomeApi,
      'clients-vmst-unemployment',
    )
    return await api.incomeCreatePartTimeJob(requestParameters)
  }

  async createCapitalIncomePayment(
    requestParameters: IncomeCreateCapitalIncomePaymentRequest,
  ): Promise<GaldurExternalDomainModelsIncomeCapitalIncomePaymentDTO> {
    const api = await this.createApiClient(
      IncomeApi,
      'clients-vmst-unemployment',
    )
    return await api.incomeCreateCapitalIncomePayment(requestParameters)
  }

  async createTRPayment(
    requestParameters: IncomeCreateTRPaymentRequest,
  ): Promise<GaldurExternalDomainModelsIncomeTRPaymentDTO> {
    const api = await this.createApiClient(
      IncomeApi,
      'clients-vmst-unemployment',
    )
    return await api.incomeCreateTRPayment(requestParameters)
  }

  async createContractorJob(
    requestParameters: UncompensatedPeriodsCreateContractorJobRequest,
  ): Promise<GaldurExternalDomainModelsIncomeContractorJobDTO> {
    const api = await this.createApiClient(
      UncompensatedPeriodsApi,
      'clients-vmst-unemployment',
    )
    return await api.uncompensatedPeriodsCreateContractorJob(requestParameters)
  }

  async getIncomeTypes(options?: {
    onlyTrTypes?: boolean
    onlyPensionTypes?: boolean
    onlyCapitalTypes?: boolean
  }): Promise<Array<GaldurExternalDomainModelsIncomeIncomeTypeDTO>> {
    const api = await this.createApiClient(
      IncomeSupportDataApi,
      'clients-vmst-unemployment',
    )
    return await api.incomeSupportDataGetIncomeTypes(options ?? {})
  }

  async createPensionPayment(
    requestParameters: IncomeCreatePensionPaymentRequest,
  ): Promise<GaldurExternalDomainModelsIncomePensionPaymentDTO> {
    const api = await this.createApiClient(
      IncomeApi,
      'clients-vmst-unemployment',
    )
    return await api.incomeCreatePensionPayment(requestParameters)
  }

  async getPensionFunds(): Promise<
    Array<GaldurExternalDomainModelsPensionFundPensionFundItemDTO>
  > {
    const api = await this.createApiClient(
      PensionFundsApi,
      'clients-vmst-unemployment',
    )
    return await api.pensionFundsGetPensionFunds()
  }

  async createApplicantRequestedAttachments(
    requestParameters: ApplicantCreateApplicantRequestedAttachmentRequest,
  ): Promise<GaldurDomainModelsBaseViewModel> {
    const api = await this.createApiClient(
      ApplicantApi,
      'clients-vmst-unemployment',
    )
    return await api.applicantCreateApplicantRequestedAttachment(
      requestParameters,
    )
  }

  async getAttachment(
    attachmentId: string,
  ): Promise<GaldurExternalDomainModelsAttachmentAttachmentDTO> {
    const api = await this.createApiClient(
      AttachmentApi,
      'clients-vmst-unemployment',
    )

    return await api.attachmentGetAttachment({
      id: attachmentId,
      includeData: true,
    })
  }
}

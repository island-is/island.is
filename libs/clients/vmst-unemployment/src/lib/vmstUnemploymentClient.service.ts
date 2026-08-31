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
  GaldurXRoadAPIModelsActivationGrantApplicationOverviewResponse,
  GaldurXRoadAPIModelsApplicationApplicationOverviewItem,
  GaldurXRoadAPIModelsApplicantApplicantOverviewResponse,
  GaldurXRoadAPIModelsApplicantInfoResponse,
  GaldurXRoadAPIModelsApplicantInfoSupportDataResponse,
  SupportDataApi,
  GaldurExternalDomainModelsSupportDataDelistingReasonDTO,
  GaldurExternalDomainRequestsWithdrawOverviewResponse,
  GaldurExternalDomainRequestsApplicantCreateForeignStayRequest,
  GaldurExternalDomainModelsAttachmentAttachmentRequestDTO,
  GaldurExternalDomainModelsAttachmentAttachmentDTO,
  GaldurXRoadAPIModelsAvailableActions,
  ApplicantUpdateApplicantRequest,
  ApplicantGetApplicantInfoRequest,
  GaldurXRoadAPIModelsJobSearchConfirmationCreateJobSearchConfirmationRequest,
  GaldurXRoadAPIModelsJobSearchConfirmationJobSearchConfirmationEligibilityResponse,
  ApplicantCreateApplicantRequestedAttachmentRequest,
  GaldurXRoadAPIModelsApplicantForeignTravelEligibilityResponse,
  GaldurDomainModelsBaseViewModel,
  GaldurXRoadAPIModelsApplicantApplicantAttachmentsResponse,
<<<<<<< HEAD
=======
  U2CertificateApi,
  GaldurExternalDomainModelsSupportDataNationalityDTO,
  GaldurDomainModelsApplicationsU2CertificateViewModelsU2CertificateValidationResponse,
  GaldurXRoadAPIModelsApplicantU2EligibilityResponse,
  GaldurXRoadAPIModelsApplicantApplicantEligibilityResponse,
>>>>>>> 4216742a2a (Further work, still missing revoke and applicationId in submit)
  JobSearchConfirmationApi,
  GaldurXRoadAPIModelsJobSearchConfirmationQuestionaireSchemaResponse,
  ApplicantWithdrawLatestApplicationRequest,
  GaldurExternalDomainRequestsHasValidApplicationResponse,
<<<<<<< HEAD
  U2CertificateApi,
  GaldurXRoadAPIModelsApplicantApplicantEligibilityResponse,
  GaldurExternalDomainModelsSupportDataNationalityDTO,
  GaldurDomainModelsApplicationsU2CertificateViewModelsU2CertificateValidationResponse,
=======
>>>>>>> 4216742a2a (Further work, still missing revoke and applicationId in submit)
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
  | ApplicantApi
  | ApplicationApi
  | SupportDataApi
<<<<<<< HEAD
  | JobSearchConfirmationApi
  | U2CertificateApi
=======
  | U2CertificateApi
  | JobSearchConfirmationApi
>>>>>>> 4216742a2a (Further work, still missing revoke and applicationId in submit)

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

  async canUserWithdrawBenefitsApplication(
    applicantId: string,
  ): Promise<GaldurExternalDomainRequestsWithdrawOverviewResponse> {
    const api = await this.createApiClient(
      ApplicantApi,
      'clients-vmst-unemployment',
    )

    return await api.applicantGetWithdrawOverview({
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

  async withdrawBenefitsApplication(
    requestParameter: ApplicantWithdrawLatestApplicationRequest,
  ): Promise<GaldurDomainModelsBaseViewModel> {
    const api = await this.createApiClient(
      ApplicantApi,
      'clients-vmst-unemployment',
    )

    return await api.applicantWithdrawLatestApplication(requestParameter)
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

  /*
    Fetches activation grant application information for the overview page on My Pages island.is
  */
  async getActivationGrantApplicationOverview(
    auth: User,
    language?: Locale,
  ): Promise<
    GaldurXRoadAPIModelsActivationGrantApplicationOverviewResponse & {
      applicationStatus: VmstApplicationStatus
    }
  > {
    const { applicantId } = await this.resolveApplicant(auth)

    const api = await this.createApiClient(
      ApplicantApi,
      'clients-vmst-unemployment',
    )

    const lang = language ? language.toUpperCase() : null

    const response =
      await api.applicantGetLatestActivationGrantApplicationOverview({
        id: applicantId,
        language: lang,
      })

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
  ): Promise<GaldurXRoadAPIModelsApplicantApplicantAttachmentsResponse> {
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
    GaldurXRoadAPIModelsApplicantApplicantEligibilityResponse & {
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

  async checkU2Eligibility(
    auth: User,
  ): Promise<GaldurXRoadAPIModelsApplicantU2EligibilityResponse> {
    const { applicantId } = await this.resolveApplicant(auth)

    if (!applicantId) {
      throw new Error('Failed to resolve applicantId')
    }

    const api = await this.createApiClient(
      U2CertificateApi,
      'clients-vmst-unemployment',
    )

    return await api.u2CertificateCanCreateU2Certificate({
      applicantId,
    })
  }

  async getEESCountries(): Promise<
    Array<GaldurExternalDomainModelsSupportDataNationalityDTO>
  > {
    const api = await this.createApiClient(
      SupportDataApi,
      'clients-vmst-unemployment',
    )

    return await api.supportDataGetAllNationalities({
      onlyInEUAndOrEEA: true,
    })
  }

  async validateU2(
    auth: User,
    dateWhenLeaving: Date,
    destinationCountryId: string,
  ): Promise<GaldurDomainModelsApplicationsU2CertificateViewModelsU2CertificateValidationResponse> {
    const { applicantId } = await this.resolveApplicant(auth)

    if (!applicantId) {
      throw new Error('Failed to resolve applicantId')
    }
    const api = await this.createApiClient(
      U2CertificateApi,
      'clients-vmst-unemployment',
    )

    return await api.u2CertificateValidateU2Certificate({
      applicantId,
      galdurExternalDomainRequestsU2CertificateCreateU2CertificateRequest: {
        dateWhenLeaving: dateWhenLeaving,
        destinationCountryId: destinationCountryId,
      },
    })
  }

  async submitU2Application(
    auth: User,
    destinationCountryId: string,
    departureDate: Date,
    applicationId: string,
  ): Promise<GaldurDomainModelsBaseViewModel> {
    const { applicantId } = await this.resolveApplicant(auth)

    if (!applicantId) {
      throw new Error('Failed to resolve applicantId')
    }
    const api = await this.createApiClient(
      U2CertificateApi,
      'clients-vmst-unemployment',
    )
    return await api.u2CertificateCreateU2Certificate({
      applicantId,
      galdurExternalDomainRequestsU2CertificateCreateU2CertificateRequest: {
        destinationCountryId,
        dateWhenLeaving: departureDate,
        applicationId,
      },
    })
  }

  async getEditProfileEligibility(
    auth: User,
  ): Promise<GaldurExternalDomainRequestsHasValidApplicationResponse> {
    const { applicantId } = await this.resolveApplicant(auth)

    if (!applicantId) {
      throw new Error('Failed to resolve applicantId')
    }
    const api = await this.createApiClient(
      ApplicantApi,
      'clients-vmst-unemployment',
    )

    return await api.applicantGetProfileEligibility({
      id: applicantId,
    })
  }

  async getQuestionnaire(): Promise<GaldurXRoadAPIModelsJobSearchConfirmationQuestionaireSchemaResponse> {
    const api = await this.createApiClient(
      JobSearchConfirmationApi,
      'clients-vmst-unemployment',
    )
    return await api.jobSearchConfirmationGetQuestionaireSchema()
  }

<<<<<<< HEAD
  async revokeU2Application(
    auth: User,
  ): Promise<GaldurDomainModelsBaseViewModel> {
=======
  async revokeU2Application(auth: User): Promise<void> {
>>>>>>> 4216742a2a (Further work, still missing revoke and applicationId in submit)
    const { applicantId } = await this.resolveApplicant(auth)

    if (!applicantId) {
      throw new Error('Failed to resolve applicantId')
    }
    const api = await this.createApiClient(
      U2CertificateApi,
      'clients-vmst-unemployment',
    )

<<<<<<< HEAD
    return await api.u2CertificateWithdrawU2Certificate({
      applicantId,
    })
=======
    return
>>>>>>> 4216742a2a (Further work, still missing revoke and applicationId in submit)
  }
}

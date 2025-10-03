import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import { Inject, Injectable } from '@nestjs/common'
import {
  ApiProtectedV1IncomePlanTemporaryCalculationsPostRequest,
  ApiProtectedV1IncomePlanWithholdingTaxGetRequest,
  ApiProtectedV1PensionCalculatorPostRequest,
  ApiProtectedV1QuestionnairesMedicalandrehabilitationpaymentsSelfassessmentGetRequest,
  ApplicantApi,
  ApplicationApi,
  DeathBenefitsApi,
  GeneralApi,
  IncomePlanApi,
  MedicalDocumentsApi,
  PaymentPlanApi,
  PensionCalculatorApi,
  QuestionnairesApi,
  TrWebApiServicesDomainApplicationsModelsApplicationTypeDto,
  TrWebApiServicesDomainApplicationsModelsCreateApplicationFromPaperReturn,
  TrWebApiServicesDomainEducationalInstitutionsModelsEctsUnitDto,
  TrWebApiServicesDomainEducationalInstitutionsModelsEducationalInstitutionsDto,
  TrWebApiServicesDomainEducationalInstitutionsModelsEducationLevelDto,
  TrWebApiServicesDomainQuestionnairesModelsQuestionnaireDto,
  TrWebApiServicesDomainUnionsModelsUnionDto,
  TrWebApiServicesUseCaseDeathBenefitsModelsExternalSpousalInfo,
  TrWebCommonsExternalPortalsApiModelsApplicantApplicantInfoReturn,
  TrWebCommonsExternalPortalsApiModelsApplicationsIsEligibleForApplicationReturn,
  TrWebCommonsExternalPortalsApiModelsDocumentsDocument,
  TrWebCommonsExternalPortalsApiModelsIncomePlanExternalIncomeTypeDto,
  TrWebCommonsExternalPortalsApiModelsIncomePlanIncomePlanConditionsDto,
  TrWebCommonsExternalPortalsApiModelsIncomePlanWithholdingTaxDto,
  TrWebCommonsExternalPortalsApiModelsPaymentPlanLegitimatePayments,
  TrWebCommonsExternalPortalsApiModelsPaymentPlanPaymentPlanDto,
  TrWebExternalModelsServicePortalBaseCertificate,
  TrWebExternalModelsServicePortalConfirmationOfIllHealth,
  TrWebExternalModelsServicePortalConfirmationOfPendingResolution,
  TrWebExternalModelsServicePortalConfirmedTreatment,
  TrWebExternalModelsServicePortalNationalRegistryAddress,
  TrWebExternalModelsServicePortalRehabilitationPlan,
  TrWebExternalModelsServicePortalDisabilityPensionCertificate,
  TrWebCommonsExternalPortalsApiModelsGeneralEmploymentStatusesForLanguage,
  TrWebApiServicesDomainProfessionsModelsActivityOfProfessionDto,
  TrWebApiServicesDomainProfessionsModelsProfessionDto,
} from '../../gen/fetch'
import { IncomePlanDto, mapIncomePlanDto } from './dto/incomePlan.dto'
import { EmploymentDto, mapEmploymentDto } from './dto/employment.dto'
import {
  ApplicationWriteApi,
  MedicalDocumentApiForDisabilityPension,
  QuestionnairesApiForDisabilityPension,
} from './socialInsuranceAdministrationClient.type'
import { ApplicationTypeEnum } from './enums'
import { mapApplicationEnumToType } from './mapper'
import { mapProfessionDto, ProfessionDto } from './dto/profession.dto'
import {
  mapProfessionActivityDto,
  ProfessionActivityDto,
} from './dto/professionActivity.dto'
import { mapResidenceDto, ResidenceDto } from './dto/residence.dto'
import { GenericLocaleInputDto } from './dto/genericLocale.dto.input'
import { LanguageDto, mapLanguageDto } from './dto/language.dto'
import { CountryDto, mapCountryDto } from './dto/country.dto'
import { mapMaritalStatusDto, MaritalStatusDto } from './dto/maritalStatus.dto'
import { DisabilityPensionDto } from './dto'
import { FeatureFlagService, Features } from '@island.is/nest/feature-flags'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class SocialInsuranceAdministrationClientService {
  constructor(
    private readonly applicationApi: ApplicationApi,
    private readonly applicationWriteApi: ApplicationWriteApi,
    private readonly applicantApi: ApplicantApi,
    private readonly paymentPlanApi: PaymentPlanApi,
    private readonly currencyApi: GeneralApi,
    private readonly pensionCalculatorApi: PensionCalculatorApi,
    private readonly deathBenefitsApi: DeathBenefitsApi,
    private readonly incomePlanApi: IncomePlanApi,
    private readonly generalApi: GeneralApi,
    private readonly medicalDocumentsApi: MedicalDocumentsApi,
    private readonly questionnairesApi: QuestionnairesApi,
    private readonly medicalDocumentsApiForDisabilityPension: MedicalDocumentApiForDisabilityPension,
    private readonly questionnairesApiForDisabilityPension: QuestionnairesApiForDisabilityPension,
    private readonly featureFlagService: FeatureFlagService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  private applicationApiWithAuth = (user: User) =>
    this.applicationApi.withMiddleware(new AuthMiddleware(user as Auth))

  private applicationWriteApiWithAuth = (user: User) =>
    this.applicationWriteApi.withMiddleware(new AuthMiddleware(user as Auth))

  private applicantApiWithAuth = (user: User) =>
    this.applicantApi.withMiddleware(new AuthMiddleware(user as Auth))

  private currencyApiWithAuth = (user: User) =>
    this.currencyApi.withMiddleware(new AuthMiddleware(user as Auth))

  private paymentPlanApiWithAuth = (user: User) =>
    this.paymentPlanApi.withMiddleware(new AuthMiddleware(user as Auth))

  private deathBenefitsApiWithAuth = (user: User) =>
    this.deathBenefitsApi.withMiddleware(new AuthMiddleware(user as Auth))

  private incomePlanApiWithAuth = (user: User) =>
    this.incomePlanApi.withMiddleware(new AuthMiddleware(user as Auth))

  private generalApiWithAuth = (user: User) =>
    this.generalApi.withMiddleware(new AuthMiddleware(user as Auth))

  private medicalDocumentsApiWithAuth = (user: User) =>
    this.medicalDocumentsApi.withMiddleware(new AuthMiddleware(user as Auth))

  private questionnairesApiWithAuth = (user: User) =>
    this.questionnairesApi.withMiddleware(new AuthMiddleware(user as Auth))

  private medicalDocumentsApiForDisabilityPensionWithAuth = (user: User) =>
    this.medicalDocumentsApiForDisabilityPension.withMiddleware(
      new AuthMiddleware(user as Auth),
    )

  private questionnairesApiForDisabilityPensionWithAuth = (user: User) =>
    this.questionnairesApiForDisabilityPension.withMiddleware(
      new AuthMiddleware(user as Auth),
    )

  getPaymentPlan(
    user: User,
  ): Promise<TrWebCommonsExternalPortalsApiModelsPaymentPlanPaymentPlanDto> {
    return this.paymentPlanApiWithAuth(user).apiProtectedV1PaymentPlanGet({
      year: undefined,
    })
  }

  async getPayments(
    user: User,
  ): Promise<TrWebCommonsExternalPortalsApiModelsPaymentPlanLegitimatePayments | null> {
    return await this.paymentPlanApiWithAuth(user)
      .apiProtectedV1PaymentPlanLegitimatepaymentsGet()
      .catch(handle404)
  }

  async getLatestIncomePlan(user: User): Promise<IncomePlanDto | null> {
    const incomePlan = await this.incomePlanApiWithAuth(user)
      .apiProtectedV1IncomePlanLatestIncomePlanGet()
      .catch(handle404)

    if (!incomePlan) {
      return null
    }

    return mapIncomePlanDto(incomePlan) ?? null
  }

  async getIncomePlanConditions(
    user: User,
  ): Promise<TrWebCommonsExternalPortalsApiModelsIncomePlanIncomePlanConditionsDto> {
    return this.incomePlanApiWithAuth(
      user,
    ).apiProtectedV1IncomePlanIncomePlanConditionsGet()
  }

  async sendDisabilityPensionApplication(
    user: User,
    input: DisabilityPensionDto,
  ): Promise<TrWebApiServicesDomainApplicationsModelsCreateApplicationFromPaperReturn> {
    const enableLightweightMode = user
      ? await this.featureFlagService.getValue(
          Features.disabilityPensionLightweightModeEnabled,
          false,
          user,
        )
      : false

    if (enableLightweightMode) {
      this.logger.info('lightweight mode enabled for post - ONLY DEV')
    }

    return this.applicationWriteApiWithAuth(
      user,
    ).apiProtectedV1ApplicationApplicationTypePost({
      applicationType: 'disabilitypension',
      lightweightValidation: enableLightweightMode,
      body: input,
    })
  }

  sendApplication(
    user: User,
    applicationDTO: object,
    applicationType: string,
  ): Promise<TrWebApiServicesDomainApplicationsModelsCreateApplicationFromPaperReturn> {
    return this.applicationWriteApiWithAuth(
      user,
    ).apiProtectedV1ApplicationApplicationTypePost({
      applicationType,
      body: applicationDTO,
    })
  }

  sendAdditionalDocuments(
    user: User,
    applicationId: string,
    documents: Array<TrWebCommonsExternalPortalsApiModelsDocumentsDocument>,
  ): Promise<void> {
    return this.applicationWriteApiWithAuth(
      user,
    ).apiProtectedV1ApplicationApplicationGuidDocumentsPost({
      applicationGuid: applicationId,
      trWebCommonsExternalPortalsApiModelsDocumentsDocument: documents,
    })
  }

  async getApplicant(
    user: User,
  ): Promise<TrWebCommonsExternalPortalsApiModelsApplicantApplicantInfoReturn> {
    return this.applicantApiWithAuth(user).apiProtectedV1ApplicantGet()
  }

  async getIsEligible(
    user: User,
    applicationType: string,
  ): Promise<TrWebCommonsExternalPortalsApiModelsApplicationsIsEligibleForApplicationReturn> {
    if (applicationType === 'disabilitypension') {
      const enableLightweightMode = user
        ? await this.featureFlagService.getValue(
            Features.disabilityPensionLightweightModeEnabled,
            false,
            user,
          )
        : false

      if (enableLightweightMode) {
        this.logger.info('lightweight mode enabled - ONLY DEV', {
          applicationType,
        })
      }

      return this.applicantApiWithAuth(
        user,
      ).apiProtectedV1ApplicantApplicationTypeEligibleGet({
        applicationType,
        lightweightValidation: enableLightweightMode ?? false,
      })
    }

    return this.applicantApiWithAuth(
      user,
    ).apiProtectedV1ApplicantApplicationTypeEligibleGet({
      applicationType,
    })
  }

  async getCurrencies(user: User): Promise<Array<string>> {
    return this.currencyApiWithAuth(user).apiProtectedV1GeneralCurrenciesGet()
  }

  async getPensionCalculation(
    parameters: ApiProtectedV1PensionCalculatorPostRequest['trWebCommonsExternalPortalsApiModelsPensionCalculatorPensionCalculatorInput'],
  ) {
    return this.pensionCalculatorApi.apiProtectedV1PensionCalculatorPost({
      trWebCommonsExternalPortalsApiModelsPensionCalculatorPensionCalculatorInput:
        parameters,
    })
  }

  async getSpousalInfo(
    user: User,
  ): Promise<TrWebApiServicesUseCaseDeathBenefitsModelsExternalSpousalInfo> {
    return this.deathBenefitsApiWithAuth(
      user,
    ).apiProtectedV1DeathBenefitsSpousalinfoGet()
  }

  async getCategorizedIncomeTypes(
    user: User,
  ): Promise<
    Array<TrWebCommonsExternalPortalsApiModelsIncomePlanExternalIncomeTypeDto>
  > {
    return this.incomePlanApiWithAuth(
      user,
    ).apiProtectedV1IncomePlanCategorizedIncomeTypesGet()
  }

  async getWithholdingTax(
    user: User,
    year: ApiProtectedV1IncomePlanWithholdingTaxGetRequest,
  ): Promise<TrWebCommonsExternalPortalsApiModelsIncomePlanWithholdingTaxDto> {
    return this.incomePlanApiWithAuth(
      user,
    ).apiProtectedV1IncomePlanWithholdingTaxGet(year)
  }

  async getTemporaryCalculations(
    user: User,
    parameters: ApiProtectedV1IncomePlanTemporaryCalculationsPostRequest['trWebApiServicesDomainFinanceModelsIslandIsIncomePlanDto'],
  ): Promise<TrWebCommonsExternalPortalsApiModelsPaymentPlanPaymentPlanDto> {
    return this.incomePlanApiWithAuth(
      user,
    ).apiProtectedV1IncomePlanTemporaryCalculationsPost({
      trWebApiServicesDomainFinanceModelsIslandIsIncomePlanDto: parameters,
    })
  }

  async getUnions(
    user: User,
  ): Promise<Array<TrWebApiServicesDomainUnionsModelsUnionDto>> {
    return this.generalApiWithAuth(user).apiProtectedV1GeneralUnionsGet()
  }

  async getRehabilitationPlan(
    user: User,
  ): Promise<TrWebExternalModelsServicePortalRehabilitationPlan> {
    return this.medicalDocumentsApiWithAuth(
      user,
    ).apiProtectedV1MedicalDocumentsRehabilitationplanGet()
  }

  async getSelfAssessmentQuestionnaire(
    user: User,
    languages: ApiProtectedV1QuestionnairesMedicalandrehabilitationpaymentsSelfassessmentGetRequest,
    applicationType: 'MARP' | 'DisabilityPension',
  ): Promise<
    Array<TrWebApiServicesDomainQuestionnairesModelsQuestionnaireDto>
  > {
    switch (applicationType) {
      case 'MARP':
        return this.questionnairesApiWithAuth(
          user,
        ).apiProtectedV1QuestionnairesMedicalandrehabilitationpaymentsSelfassessmentGet(
          languages,
        )
      case 'DisabilityPension':
        return this.questionnairesApiForDisabilityPensionWithAuth(
          user,
        ).apiProtectedV1QuestionnairesDisabilitypensionSelfassessmentGet(
          languages,
        )
    }
  }

  async getCertificateForSicknessAndRehabilitation(
    user: User,
  ): Promise<TrWebExternalModelsServicePortalBaseCertificate> {
    return this.medicalDocumentsApiWithAuth(
      user,
    ).apiProtectedV1MedicalDocumentsBasecertificateGet()
  }

  async getCertificateForDisabilityPension(
    user: User,
  ): Promise<TrWebExternalModelsServicePortalDisabilityPensionCertificate> {
    return this.medicalDocumentsApiForDisabilityPensionWithAuth(
      user,
    ).apiProtectedV1MedicalDocumentsDisabilitypensioncertificateGet()
  }

  async getConfirmedTreatment(
    user: User,
  ): Promise<TrWebExternalModelsServicePortalConfirmedTreatment> {
    return this.medicalDocumentsApiWithAuth(
      user,
    ).apiProtectedV1MedicalDocumentsConfirmedtreatmentGet()
  }

  async getConfirmationOfPendingResolution(
    user: User,
  ): Promise<TrWebExternalModelsServicePortalConfirmationOfPendingResolution> {
    return this.medicalDocumentsApiWithAuth(
      user,
    ).apiProtectedV1MedicalDocumentsConfirmationofpendingresolutionGet()
  }

  async getConfirmationOfIllHealth(
    user: User,
  ): Promise<TrWebExternalModelsServicePortalConfirmationOfIllHealth> {
    return this.medicalDocumentsApiWithAuth(
      user,
    ).apiProtectedV1MedicalDocumentsConfirmationofillhealthGet()
  }

  async getCountries(
    user: User,
    { locale }: GenericLocaleInputDto,
  ): Promise<Array<CountryDto> | null> {
    const data = await this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralCountriesGet()

    return (
      data
        .map((d) => mapCountryDto(d, locale))
        .filter((i): i is CountryDto => Boolean(i)) ?? null
    )
  }

  async getLanguages(
    user: User,
    { locale }: GenericLocaleInputDto,
  ): Promise<Array<LanguageDto> | null> {
    const data = await this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralLanguagesGet()

    return (
      data
        .map((d) => mapLanguageDto(d, locale))
        .filter((i): i is LanguageDto => Boolean(i)) ?? null
    )
  }

  async getMaritalStatuses(user: User): Promise<Array<MaritalStatusDto>> {
    const data = await this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralMaritalStatusesGet()

    return data
      .map((d) => mapMaritalStatusDto(d))
      .filter((i): i is MaritalStatusDto => Boolean(i))
  }

  async getEmploymentStatusesWithLocale(
    user: User,
    { locale }: GenericLocaleInputDto,
  ): Promise<Array<EmploymentDto> | null> {
    const data = await this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralEmploymentStatusGet()

    const filteredData = data.find(
      (d) => d.languageCode === locale.toString().toUpperCase(),
    )

    if (!filteredData) {
      throw new Error('Locale not supplied in response')
    }

    return (
      filteredData.employmentStatuses
        ?.map((es) => mapEmploymentDto(es))
        .filter((i): i is EmploymentDto => Boolean(i)) ?? null
    )
  }

  async getResidenceTypes(user: User): Promise<Array<ResidenceDto> | null> {
    const data = await this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralHousingTypesGet()

    return (
      data
        .map((d) => mapResidenceDto(d))
        .filter((i): i is ResidenceDto => Boolean(i)) ?? null
    )
  }

  async getProfessions(
    user: User,
  ): Promise<Array<TrWebApiServicesDomainProfessionsModelsProfessionDto>> {
    return this.generalApiWithAuth(user).apiProtectedV1GeneralProfessionsGet()
  }

  async getActivitiesOfProfessions(
    user: User,
  ): Promise<
    Array<TrWebApiServicesDomainProfessionsModelsActivityOfProfessionDto>
  > {
    return this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralProfessionsActivitiesGet()
  }

  async getProfessionsInDto(user: User): Promise<Array<ProfessionDto> | null> {
    const data = await this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralProfessionsGet()

    return (
      data
        .map((d) => mapProfessionDto(d))
        .filter((i): i is ProfessionDto => Boolean(i)) ?? null
    )
  }

  async getProfessionActivitiesInDto(
    user: User,
  ): Promise<Array<ProfessionActivityDto> | null> {
    const data = await this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralProfessionsActivitiesGet()

    return (
      data
        .map((d) => mapProfessionActivityDto(d))
        .filter((i): i is ProfessionActivityDto => Boolean(i)) ?? null
    )
  }

  async getEducationalInstitutions(
    user: User,
  ): Promise<
    Array<TrWebApiServicesDomainEducationalInstitutionsModelsEducationalInstitutionsDto>
  > {
    return this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralEducationalinstitutionsGet()
  }

  async getEctsUnits(
    user: User,
  ): Promise<
    Array<TrWebApiServicesDomainEducationalInstitutionsModelsEctsUnitDto>
  > {
    return this.generalApiWithAuth(user).apiProtectedV1GeneralEctsUnitsGet()
  }

  async getResidenceInformation(
    user: User,
  ): Promise<TrWebExternalModelsServicePortalNationalRegistryAddress> {
    return this.applicantApiWithAuth(
      user,
    ).apiProtectedV1ApplicantResidenceInformationGet()
  }

  async getEducationLevelsWithEnum(
    user: User,
    applicationType: ApplicationTypeEnum,
  ): Promise<Array<TrWebApiServicesDomainEducationalInstitutionsModelsEducationLevelDto> | null> {
    const applicationTypeMapped = mapApplicationEnumToType(applicationType)

    if (!applicationTypeMapped) {
      return Promise.resolve(null)
    }

    return this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralEducationlevelsApplicationTypeGet({
      applicationType: applicationTypeMapped,
    })
  }

  async getEducationLevels(
    user: User,
    applicationType: string,
  ): Promise<
    Array<TrWebApiServicesDomainEducationalInstitutionsModelsEducationLevelDto>
  > {
    return this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralEducationlevelsApplicationTypeGet({
      applicationType,
    })
  }

  async getMedicalAndRehabilitationApplicationType(
    user: User,
  ): Promise<TrWebApiServicesDomainApplicationsModelsApplicationTypeDto> {
    return this.applicantApiWithAuth(
      user,
    ).apiProtectedV1ApplicantMedicalandrehabilitationpaymentsTypeGet()
  }

  async getEmploymentStatuses(
    user: User,
  ): Promise<
    Array<TrWebCommonsExternalPortalsApiModelsGeneralEmploymentStatusesForLanguage>
  > {
    return this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralEmploymentStatusGet()
  }
}

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import { Injectable } from '@nestjs/common'
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
  TrWebApiServicesCommonCountriesModelsCountryDto,
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
  TrWebExternalModelsServicePortalNationalRegistryAddress,
  TrWebExternalModelsServicePortalBaseCertificate,
  TrWebExternalModelsServicePortalConfirmationOfIllHealth,
  TrWebExternalModelsServicePortalConfirmationOfPendingResolution,
  TrWebExternalModelsServicePortalConfirmedTreatment,
  TrWebExternalModelsServicePortalRehabilitationPlan,
  TrWebExternalModelsServicePortalDisabilityPensionCertificate,
  TrWebApiServicesCommonCountriesModelsLanguageDto,
  TrWebApiServicesUseCaseDisabilityPensionModelsMaritalStatusDto,
  TrWebApiServicesUseCaseDisabilityPensionModelsHousingTypesStatusDto,
  TrWebCommonsExternalPortalsApiModelsGeneralEmploymentStatusesForLanguage,
  TrWebApiServicesDomainProfessionsModelsProfessionDto,
  TrWebApiServicesDomainProfessionsModelsActivityOfProfessionDto,
} from '../../gen/fetch'
import { IncomePlanDto, mapIncomePlanDto } from './dto/incomePlan.dto'
import { ApplicationWriteApi } from './socialInsuranceAdministrationClient.type'
import { ApplicationTypeEnum } from './enums'
import { mapApplicationEnumToType } from './mapper'

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
        return this.questionnairesApiWithAuth(
          user,
        ).apiProtectedV1QuestionnairesMedicalandrehabilitationpaymentsSelfassessmentGet(
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
    return this.medicalDocumentsApiWithAuth(
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
  ): Promise<Array<TrWebApiServicesCommonCountriesModelsCountryDto>> {
    const data = await this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralCountriesGet()

    return data.filter(
      (country) => country.code && country.nameIcelandic && country.name,
    )
  }

  async getLanguages(
    user: User,
  ): Promise<Array<TrWebApiServicesCommonCountriesModelsLanguageDto>> {
    const data = await this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralLanguagesGet()

    return data.filter(
      (language) => language.code && language.nameIs && language.nameEn,
    )
  }

  async getMaritalStatuses(
    user: User,
  ): Promise<
    Array<TrWebApiServicesUseCaseDisabilityPensionModelsMaritalStatusDto>
  > {
    const data = await this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralMaritalStatusesGet()

    return data.filter((language) => language.value && language.label)
  }

  async getHousingTypes(
    user: User,
  ): Promise<
    Array<TrWebApiServicesUseCaseDisabilityPensionModelsHousingTypesStatusDto>
  > {
    const data = await this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralHousingTypesGet()

    return data.filter((housingType) => housingType.value && housingType.label)
  }

  async getEmploymentStatuses(
    user: User,
  ): Promise<
    Array<TrWebCommonsExternalPortalsApiModelsGeneralEmploymentStatusesForLanguage>
  > {
    const data = await this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralEmploymentStatusGet()

    return data.filter(
      (employmentStatus) =>
        employmentStatus.employmentStatuses && employmentStatus.languageCode,
    )
  }

  async getProfessions(
    user: User,
  ): Promise<Array<TrWebApiServicesDomainProfessionsModelsProfessionDto>> {
    const data = await this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralProfessionsGet()

    return data.filter(
      (profession) => profession.description && profession.value,
    )
  }

  async getProfessionActivities(
    user: User,
  ): Promise<
    Array<TrWebApiServicesDomainProfessionsModelsActivityOfProfessionDto>
  > {
    const data = await this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralProfessionsActivitiesGet()

    return data.filter(
      (professionActivity) =>
        professionActivity.description && professionActivity.value,
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

  /**
   * TODO: Map all used application types to the enum and deprecate the old method
   */
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
}

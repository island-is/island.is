import { YES } from '@island.is/application/core'
import { FileType } from '@island.is/application/templates/social-insurance-administration-core/types'
import { getApplicationAnswers as getASFTEApplicationAnswers } from '@island.is/application/templates/social-insurance-administration/additional-support-for-the-elderly'
import {
  ChildInformation,
  getApplicationAnswers as getDBApplicationAnswers,
} from '@island.is/application/templates/social-insurance-administration/death-benefits'
import { getApplicationAnswers as getHSApplicationAnswers } from '@island.is/application/templates/social-insurance-administration/household-supplement'
import { getApplicationExternalData as getMARPApplicationExternalData } from '@island.is/application/templates/social-insurance-administration/medical-and-rehabilitation-payments'
import {
  ApplicationType,
  Employment,
  getApplicationAnswers as getOAPApplicationAnswers,
  isEarlyRetirement,
} from '@island.is/application/templates/social-insurance-administration/old-age-pension'
import { getApplicationAnswers as getPSApplicationAnswers } from '@island.is/application/templates/social-insurance-administration/pension-supplement'
import { Application, ApplicationTypes } from '@island.is/application/types'
import {
  DocumentTypeEnum,
  SocialInsuranceAdministrationClientService,
  type TrWebContractsExternalDigitalIcelandDocumentsDocument as Attachment,
  type ApiProtectedV1IncomePlanWithholdingTaxGetRequest,
  type ApiProtectedV1QuestionnairesMedicalandrehabilitationpaymentsSelfassessmentGetRequest,
  type ApiProtectedV1QuestionnairesDisabilitypensionSelfassessmentGetRequest,
} from '@island.is/clients/social-insurance-administration'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { S3Service } from '@island.is/nest/aws'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import * as kennitala from 'kennitala'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { sharedModuleConfig } from '../../shared'
import {
  getApplicationType,
  transformApplicationToAdditionalSupportForTheElderlyDTO,
  transformApplicationToDeathBenefitsDTO,
  transformApplicationToDisabilityPensionDTO,
  transformApplicationToHouseholdSupplementDTO,
  transformApplicationToIncomePlanDTO,
  transformApplicationToMedicalAndRehabilitationPaymentsDTO,
  transformApplicationToOldAgePensionDTO,
  transformApplicationToPensionSupplementDTO,
} from './social-insurance-administration-utils'
import { ApplicationTypeEnum } from '@island.is/clients/social-insurance-administration'
import {
  IndividualDto,
  NationalRegistryV3ApplicationsClientService,
} from '@island.is/clients/national-registry-v3-applications'

export const APPLICATION_ATTACHMENT_BUCKET = 'APPLICATION_ATTACHMENT_BUCKET'

@Injectable()
export class SocialInsuranceAdministrationService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private siaClientService: SocialInsuranceAdministrationClientService,
    @Inject(sharedModuleConfig.KEY)
    private config: ConfigType<typeof sharedModuleConfig>,
    private readonly s3Service: S3Service,
    private readonly nationalRegistryV3ApplicationsApi: NationalRegistryV3ApplicationsClientService,
  ) {
    super('SocialInsuranceAdministration')
  }

  private async initAttachments(
    application: Application,
    type: DocumentTypeEnum,
    attachments: FileType[],
  ): Promise<Attachment[]> {
    const result: Attachment[] = []

    for (const attachment of attachments) {
      const Key = `${application.id}/${attachment.key}`
      const pdf = await this.getPdf(Key)

      result.push({
        name: attachment.name,
        type,
        file: pdf,
      })
    }

    return result
  }

  private async getAdditionalAttachments(
    application: Application,
  ): Promise<Array<Attachment>> {
    const attachments: Array<Attachment> = []
    let additionalAttachmentsRequired: FileType[] = []

    if (application.typeId === ApplicationTypes.OLD_AGE_PENSION) {
      additionalAttachmentsRequired = getOAPApplicationAnswers(
        application.answers,
      ).additionalAttachmentsRequired
    }

    if (application.typeId === ApplicationTypes.HOUSEHOLD_SUPPLEMENT) {
      additionalAttachmentsRequired = getHSApplicationAnswers(
        application.answers,
      ).additionalAttachmentsRequired
    }

    if (
      application.typeId === ApplicationTypes.ADDITIONAL_SUPPORT_FOR_THE_ELDERLY
    ) {
      additionalAttachmentsRequired = getASFTEApplicationAnswers(
        application.answers,
      ).additionalAttachmentsRequired
    }

    if (application.typeId === ApplicationTypes.PENSION_SUPPLEMENT) {
      additionalAttachmentsRequired = getPSApplicationAnswers(
        application.answers,
      ).additionalAttachmentsRequired
    }

    if (application.typeId === ApplicationTypes.DEATH_BENEFITS) {
      additionalAttachmentsRequired = getDBApplicationAnswers(
        application.answers,
      ).additionalAttachmentsRequired
    }

    if (
      additionalAttachmentsRequired &&
      additionalAttachmentsRequired.length > 0
    ) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          DocumentTypeEnum.OTHER,
          additionalAttachmentsRequired,
        )),
      )
    }

    return attachments
  }

  private async getOAPAttachments(
    application: Application,
  ): Promise<Attachment[]> {
    const {
      additionalAttachments,
      pensionAttachments,
      fishermenAttachments,
      selfEmployedAttachments,
      earlyRetirementAttachments,
      applicationType,
      employmentStatus,
    } = getOAPApplicationAnswers(application.answers)

    const attachments: Attachment[] = []

    if (additionalAttachments && additionalAttachments.length > 0) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          DocumentTypeEnum.OTHER,
          additionalAttachments,
        )),
      )
    }

    if (pensionAttachments && pensionAttachments.length > 0) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          DocumentTypeEnum.PENSION,
          pensionAttachments,
        )),
      )
    }

    if (
      fishermenAttachments &&
      fishermenAttachments.length > 0 &&
      applicationType === ApplicationType.SAILOR_PENSION
    ) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          DocumentTypeEnum.SAILOR,
          fishermenAttachments,
        )),
      )
    }

    if (
      selfEmployedAttachments &&
      selfEmployedAttachments.length > 0 &&
      employmentStatus === Employment.SELFEMPLOYED
    ) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          DocumentTypeEnum.SELF_EMPLOYED,
          selfEmployedAttachments,
        )),
      )
    }

    if (
      isEarlyRetirement(application.answers, application.externalData) &&
      earlyRetirementAttachments &&
      earlyRetirementAttachments.length > 0
    ) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          DocumentTypeEnum.RETIREMENT,
          earlyRetirementAttachments,
        )),
      )
    }

    return attachments
  }

  private async getHSAttachments(
    application: Application,
  ): Promise<Attachment[]> {
    const { schoolConfirmationAttachments, householdSupplementChildren } =
      getHSApplicationAnswers(application.answers)

    const attachments: Attachment[] = []

    if (
      schoolConfirmationAttachments &&
      schoolConfirmationAttachments.length > 0 &&
      householdSupplementChildren === YES
    ) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          DocumentTypeEnum.SCHOOL_CONFIRMATION,
          schoolConfirmationAttachments,
        )),
      )
    }

    return attachments
  }

  // Pension suppliment attachments
  private async getPSAttachments(
    application: Application,
  ): Promise<Attachment[]> {
    const {
      additionalAttachments,
      assistedCareAtHomeAttachments,
      houseRentAttachments,
      houseRentAllowanceAttachments,
      assistedLivingAttachments,
      purchaseOfHearingAidsAttachments,
      halfwayHouseAttachments,
    } = getPSApplicationAnswers(application.answers)

    const attachments: Attachment[] = []

    if (additionalAttachments && additionalAttachments.length > 0) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          DocumentTypeEnum.OTHER,
          additionalAttachments,
        )),
      )
    }

    if (
      assistedCareAtHomeAttachments &&
      assistedCareAtHomeAttachments.length > 0
    ) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          DocumentTypeEnum.ASSISTED_CARE_AT_HOME,
          assistedCareAtHomeAttachments,
        )),
      )
    }

    if (houseRentAttachments && houseRentAttachments.length > 0) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          DocumentTypeEnum.HOUSE_RENT_AGREEMENT,
          houseRentAttachments,
        )),
      )
    }

    if (
      houseRentAllowanceAttachments &&
      houseRentAllowanceAttachments.length > 0
    ) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          DocumentTypeEnum.HOUSE_RENT_ALLOWANCE,
          houseRentAllowanceAttachments,
        )),
      )
    }

    if (assistedLivingAttachments && assistedLivingAttachments.length > 0) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          DocumentTypeEnum.ASSISTED_LIVING,
          assistedLivingAttachments,
        )),
      )
    }

    if (
      purchaseOfHearingAidsAttachments &&
      purchaseOfHearingAidsAttachments.length > 0
    ) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          DocumentTypeEnum.PURCHASE_OF_HEARING_AIDS,
          purchaseOfHearingAidsAttachments,
        )),
      )
    }

    if (halfwayHouseAttachments && halfwayHouseAttachments.length > 0) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          DocumentTypeEnum.HALFWAY_HOUSE,
          halfwayHouseAttachments,
        )),
      )
    }

    return attachments
  }

  private async getDBAttachments(
    application: Application,
  ): Promise<Attachment[]> {
    const {
      additionalAttachments,
      expectingChildAttachments,
      deathCertificateAttachments,
      isExpectingChild,
    } = getDBApplicationAnswers(application.answers)

    const attachments: Attachment[] = []

    if (additionalAttachments && additionalAttachments.length > 0) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          DocumentTypeEnum.OTHER,
          additionalAttachments,
        )),
      )
    }

    if (deathCertificateAttachments && deathCertificateAttachments.length > 0) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          DocumentTypeEnum.DEATH_CERTIFICATE,
          deathCertificateAttachments,
        )),
      )
    }

    if (
      expectingChildAttachments &&
      expectingChildAttachments.length > 0 &&
      isExpectingChild === YES
    ) {
      attachments.push(
        ...(await this.initAttachments(
          application,
          DocumentTypeEnum.EXPECTING_CHILD,
          expectingChildAttachments,
        )),
      )
    }

    return attachments
  }

  async getPdf(key: string): Promise<string> {
    const fileContent = await this.s3Service.getFileContent(
      { bucket: this.config.templateApi.attachmentBucket, key },
      'base64',
    )

    if (!fileContent) {
      throw new Error('File content was undefined')
    }

    return fileContent
  }

  async sendApplication({ application, auth }: TemplateApiModuleActionProps) {
    if (application.typeId === ApplicationTypes.OLD_AGE_PENSION) {
      const attachments = await this.getOAPAttachments(application)

      const oldAgePensionDTO = transformApplicationToOldAgePensionDTO(
        application,
        attachments,
      )

      const applicationType = getApplicationType(application).toLowerCase()

      const response = await this.siaClientService.sendApplication(
        auth,
        oldAgePensionDTO,
        applicationType,
      )

      return response
    }

    if (application.typeId === ApplicationTypes.HOUSEHOLD_SUPPLEMENT) {
      const attachments = await this.getHSAttachments(application)
      const householdSupplementDTO =
        transformApplicationToHouseholdSupplementDTO(application, attachments)

      const response = await this.siaClientService.sendApplication(
        auth,
        householdSupplementDTO,
        application.typeId.toLowerCase(),
      )

      return response
    }

    if (application.typeId === ApplicationTypes.PENSION_SUPPLEMENT) {
      const attachments = await this.getPSAttachments(application)
      const pensionSupplementDTO = transformApplicationToPensionSupplementDTO(
        application,
        attachments,
      )

      const response = await this.siaClientService.sendApplication(
        auth,
        pensionSupplementDTO,
        application.typeId.toLowerCase(),
      )

      return response
    }

    if (
      application.typeId === ApplicationTypes.ADDITIONAL_SUPPORT_FOR_THE_ELDERLY
    ) {
      const additionalSupportForTheElderlyDTO =
        transformApplicationToAdditionalSupportForTheElderlyDTO(application)

      const response = await this.siaClientService.sendApplication(
        auth,
        additionalSupportForTheElderlyDTO,
        application.typeId.toLowerCase(),
      )
      return response
    }

    if (application.typeId === ApplicationTypes.DEATH_BENEFITS) {
      const attachments = await this.getDBAttachments(application)

      const deathBenefitsDTO = transformApplicationToDeathBenefitsDTO(
        application,
        attachments,
      )

      const response = await this.siaClientService.sendApplication(
        auth,
        deathBenefitsDTO,
        application.typeId.toLowerCase(),
      )
      return response
    }

    if (application.typeId === ApplicationTypes.INCOME_PLAN) {
      const incomePlanDTO = transformApplicationToIncomePlanDTO(application)

      const response = await this.siaClientService.sendApplication(
        auth,
        incomePlanDTO,
        application.typeId.toLowerCase(),
      )
      return response
    }

    if (
      application.typeId ===
      ApplicationTypes.MEDICAL_AND_REHABILITATION_PAYMENTS
    ) {
      const marpDTO =
        transformApplicationToMedicalAndRehabilitationPaymentsDTO(application)

      const response = await this.siaClientService.sendApplication(
        auth,
        marpDTO,
        application.typeId.toLowerCase(),
      )

      return response
    }

    if (application.typeId === ApplicationTypes.DISABILITY_PENSION) {
      const disabilityPensionDTO =
        transformApplicationToDisabilityPensionDTO(application)

      const response =
        await this.siaClientService.sendDisabilityPensionApplication(
          auth,
          disabilityPensionDTO,
        )

      return response
    }
  }

  async sendDocuments({ application, auth }: TemplateApiModuleActionProps) {
    const attachments = await this.getAdditionalAttachments(application)

    await this.siaClientService.sendAdditionalDocuments(
      auth,
      application.id,
      attachments,
    )
  }

  async getApplicant({ auth }: TemplateApiModuleActionProps) {
    const res = await this.siaClientService.getApplicant(auth)

    // mock data since gervimenn don't have bank account registered at TR,
    // and might also not have phone number and email address registered
    if (isRunningOnEnvironment('local')) {
      if (res.bankAccount) {
        res.bankAccount.bank = '2222'
        res.bankAccount.ledger = '00'
        res.bankAccount.accountNumber = '123456'
      }

      if (!res.emailAddress) {
        res.emailAddress = 'mail@mail.is'
      }

      if (!res.phoneNumber) {
        res.phoneNumber = '888-8888'
      }
    }

    return res
  }

  async getIsEligible({ application, auth }: TemplateApiModuleActionProps) {
    switch (application.typeId) {
      case ApplicationTypes.OLD_AGE_PENSION: {
        const { applicationType } = getOAPApplicationAnswers(
          application.answers,
        )

        return await this.siaClientService.getIsEligible(
          auth,
          applicationType.toLowerCase(),
        )
      }
      case ApplicationTypes.DISABILITY_PENSION: {
        return await this.siaClientService.getIsEligible(
          auth,
          'disabilitypension',
        )
      }
      default: {
        return await this.siaClientService.getIsEligible(
          auth,
          application.typeId.toLowerCase(),
        )
      }
    }
  }

  async getCurrencies({ auth }: TemplateApiModuleActionProps) {
    return await this.siaClientService.getCurrencies(auth)
  }

  async getResidenceTypes({ auth }: TemplateApiModuleActionProps) {
    return await this.siaClientService.getResidenceTypes(auth)
  }

  async getChildrenWithSameDomicile({ auth }: TemplateApiModuleActionProps) {
    const cohabitantsDetailed =
      await this.nationalRegistryV3ApplicationsApi.getCohabitantsDetailed(
        auth.nationalId,
        auth,
      )

    const children: Array<ChildInformation> = []

    cohabitantsDetailed?.cohabitants
      .filter((c): c is IndividualDto => c !== null)
      .forEach((cohabitant) => {
        if (
          cohabitant.nationalId !== auth.nationalId &&
          kennitala.info(cohabitant.nationalId).age < 18
        ) {
          children.push({
            nationalId: cohabitant.nationalId,
            fullName: cohabitant.name,
          })
        }
      })

    return children
  }

  async getSpousalInfo({ auth }: TemplateApiModuleActionProps) {
    return await this.siaClientService.getSpousalInfo(auth)
  }

  async getCategorizedIncomeTypes({ auth }: TemplateApiModuleActionProps) {
    return await this.siaClientService.getCategorizedIncomeTypes(auth)
  }

  async getWithholdingTax(
    { auth }: TemplateApiModuleActionProps,
    year: ApiProtectedV1IncomePlanWithholdingTaxGetRequest = {},
  ) {
    return await this.siaClientService.getWithholdingTax(auth, year)
  }

  async getLatestIncomePlan({ auth }: TemplateApiModuleActionProps) {
    return await this.siaClientService.getLatestIncomePlan(auth)
  }

  async getIncomePlanConditions({ auth }: TemplateApiModuleActionProps) {
    return await this.siaClientService.getIncomePlanConditions(auth)
  }

  async getMARPSelfAssessmentQuestionnaire(
    { auth }: TemplateApiModuleActionProps,
    languages: ApiProtectedV1QuestionnairesMedicalandrehabilitationpaymentsSelfassessmentGetRequest = {},
  ) {
    return await this.siaClientService.getSelfAssessmentQuestionnaire(
      auth,
      languages,
      'MARP',
    )
  }

  async getDisabilityPensionSelfAssessmentQuestionnaire(
    { auth }: TemplateApiModuleActionProps,
    languages:
      | ApiProtectedV1QuestionnairesDisabilitypensionSelfassessmentGetRequest
      | ApiProtectedV1QuestionnairesDisabilitypensionSelfassessmentGetRequest = {},
  ) {
    return await this.siaClientService.getSelfAssessmentQuestionnaire(
      auth,
      languages,
      'DisabilityPension',
    )
  }

  async getEctsUnits({ auth }: TemplateApiModuleActionProps) {
    return await this.siaClientService.getEctsUnits(auth)
  }

  async getResidenceInformation({ auth }: TemplateApiModuleActionProps) {
    return await this.siaClientService.getResidenceInformation(auth)
  }

  async getEducationLevels({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const { marpApplicationType, isEligible } = getMARPApplicationExternalData(
      application.externalData,
    )

    if (!isEligible?.isEligible) {
      return null
    }

    return await this.siaClientService.getEducationLevels(
      auth,
      marpApplicationType || '',
    )
  }

  async getEducationLevelsWithEnum({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    if (application.typeId === ApplicationTypes.DISABILITY_PENSION) {
      return await this.siaClientService.getEducationLevelsWithEnum(
        auth,
        ApplicationTypeEnum.DISABILITY_PENSION,
      )
    }
  }

  async getCertificate({ application, auth }: TemplateApiModuleActionProps) {
    if (application.typeId === ApplicationTypes.DISABILITY_PENSION) {
      return await this.siaClientService.getCertificateForDisabilityPension(
        auth,
      )
    }
  }

  async getCountries({
    auth,
    currentUserLocale,
  }: TemplateApiModuleActionProps) {
    return await this.siaClientService.getCountries(auth, {
      locale: currentUserLocale,
    })
  }

  async getMaritalStatuses({ auth }: TemplateApiModuleActionProps) {
    return await this.siaClientService.getMaritalStatuses(auth)
  }

  async getLanguages({
    auth,
    currentUserLocale,
  }: TemplateApiModuleActionProps) {
    return await this.siaClientService.getLanguages(auth, {
      locale: currentUserLocale,
    })
  }

  async getMedicalAndRehabilitationApplicationType({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const { isEligible } = getMARPApplicationExternalData(
      application.externalData,
    )

    if (!isEligible?.isEligible) {
      return null
    }

    return await this.siaClientService.getMedicalAndRehabilitationApplicationType(
      auth,
    )
  }

  async getEmploymentStatusesWithLocale({
    auth,
    currentUserLocale,
  }: TemplateApiModuleActionProps) {
    return await this.siaClientService.getEmploymentStatusesWithLocale(auth, {
      locale: currentUserLocale,
    })
  }

  async getProfessionsInDto({ auth }: TemplateApiModuleActionProps) {
    return await this.siaClientService.getProfessionsInDto(auth)
  }

  async getProfessionActivitiesInDto({ auth }: TemplateApiModuleActionProps) {
    return await this.siaClientService.getProfessionActivitiesInDto(auth)
  }

  async getProfessions({ auth }: TemplateApiModuleActionProps) {
    return await this.siaClientService.getProfessions(auth)
  }

  async getActivitiesOfProfessions({ auth }: TemplateApiModuleActionProps) {
    return await this.siaClientService.getActivitiesOfProfessions(auth)
  }

  async getEmploymentStatuses({ auth }: TemplateApiModuleActionProps) {
    return await this.siaClientService.getEmploymentStatuses(auth)
  }
}

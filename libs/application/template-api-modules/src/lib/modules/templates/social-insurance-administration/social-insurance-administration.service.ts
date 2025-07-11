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
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import {
  ApiProtectedV1IncomePlanWithholdingTaxGetRequest,
  ApiProtectedV1QuestionnairesSelfassessmentGetRequest,
  TrWebCommonsExternalPortalsApiModelsDocumentsDocument as Attachment,
  DocumentTypeEnum,
  SocialInsuranceAdministrationClientService,
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
  transformApplicationToHouseholdSupplementDTO,
  transformApplicationToIncomePlanDTO,
  transformApplicationToMedicalAndRehabilitationPaymentsDTO,
  transformApplicationToOldAgePensionDTO,
  transformApplicationToPensionSupplementDTO,
} from './social-insurance-administration-utils'

export const APPLICATION_ATTACHMENT_BUCKET = 'APPLICATION_ATTACHMENT_BUCKET'

@Injectable()
export class SocialInsuranceAdministrationService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private siaClientService: SocialInsuranceAdministrationClientService,
    @Inject(sharedModuleConfig.KEY)
    private config: ConfigType<typeof sharedModuleConfig>,
    private readonly s3Service: S3Service,
    private readonly nationalRegistryApi: NationalRegistryClientService,
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
    if (application.typeId === ApplicationTypes.OLD_AGE_PENSION) {
      const { applicationType } = getOAPApplicationAnswers(application.answers)

      return await this.siaClientService.getIsEligible(
        auth,
        applicationType.toLowerCase(),
      )
    } else {
      return await this.siaClientService.getIsEligible(
        auth,
        application.typeId.toLowerCase(),
      )
    }
  }

  async getCurrencies({ auth }: TemplateApiModuleActionProps) {
    return await this.siaClientService.getCurrencies(auth)
  }

  async getChildrenWithSameDomicile({ auth }: TemplateApiModuleActionProps) {
    const cohabitants = await this.nationalRegistryApi.getCohabitants(
      auth.nationalId,
    )

    const children: Array<ChildInformation | null> = await Promise.all(
      cohabitants.map(async (cohabitantsNationalId) => {
        if (
          cohabitantsNationalId !== auth.nationalId &&
          kennitala.info(cohabitantsNationalId).age < 18
        ) {
          const child = await this.nationalRegistryApi.getIndividual(
            cohabitantsNationalId,
          )

          if (!child) {
            return null
          }

          return (
            child && {
              nationalId: child.nationalId,
              fullName: child.name,
            }
          )
        } else {
          return null
        }
      }),
    )

    const filteredChildren = children.filter(
      (child): child is ChildInformation => child != null,
    )
    return filteredChildren
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

  async getSelfAssessmentQuestionnaire(
    { auth }: TemplateApiModuleActionProps,
    languages: ApiProtectedV1QuestionnairesSelfassessmentGetRequest = {},
  ) {
    return await this.siaClientService.getSelfAssessmentQuestionnaire(
      auth,
      languages,
    )
  }

  async getEctsUnits({ auth }: TemplateApiModuleActionProps) {
    return await this.siaClientService.getEctsUnits(auth)
  }

  async getEducationLevels({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const { marpApplicationType } = getMARPApplicationExternalData(
      application.externalData,
    )

    return await this.siaClientService.getEducationLevels(
      auth,
      marpApplicationType || '',
    )
  }

  async getMedicalAndRehabilitationApplicationType({
    auth,
  }: TemplateApiModuleActionProps) {
    return await this.siaClientService.getMedicalAndRehabilitationApplicationType(
      auth,
    )
  }
}

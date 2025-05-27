import { YES } from '@island.is/application/core'
import { FileType } from '@island.is/application/templates/social-insurance-administration-core/types'
import { getApplicationAnswers as getASFTEApplicationAnswers } from '@island.is/application/templates/social-insurance-administration/additional-support-for-the-elderly'
import {
  ChildInformation,
  getApplicationAnswers as getDBApplicationAnswers,
} from '@island.is/application/templates/social-insurance-administration/death-benefits'
import { getApplicationAnswers as getHSApplicationAnswers } from '@island.is/application/templates/social-insurance-administration/household-supplement'
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
  TrWebCommonsExternalPortalsApiModelsDocumentsDocument as Attachment,
  DocumentTypeEnum,
  SocialInsuranceAdministrationClientService,
} from '@island.is/clients/social-insurance-administration'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { S3Service } from '@island.is/nest/aws'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { ConsoleLogger, Inject, Injectable } from '@nestjs/common'
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

  async getSelfAssessmentQuestionnaire({ auth }: TemplateApiModuleActionProps) {
    // TODO: Get Questionnaire from TR

    return {
      questionnaireName: 'Færnimat: Sjálfsmat ICF',
      questionnaireCode: 'ICF',
      versionNumber: '1.0',
      scaleMin: 0,
      scaleMax: 4,
      questions: [
        {
          questionCode: '3244CE48671C2E62E0631F72040A8546',
          title: 'Ávinna sér leikni',
          description:
            'Að læra nýja hluti og tileinka þér þekkingu (t.d. læra á tölvu, læra að nota ný verkfæri o.s.frv.)',
          icfCode: 'd155',
        },
        {
          questionCode: '3244CE48671D2E62E0631F72040A8546',
          title: 'Einbeita sér',
          description:
            'Að viðhalda einbeitingu í tilteknum verkefnum þrátt fyrir truflanir',
          icfCode: 'd160',
        },
        {
          questionCode: '3244CE48671E2E62E0631F72040A8546',
          title: 'Leysa vanda',
          description:
            'Að greina vandamál í daglegu lífi og finna lausnir á þeim',
          icfCode: 'd175',
        },
        {
          questionCode: '3244CE48671F2E62E0631F72040A8546',
          title: 'Taka ákvarðanir',
          description: 'Að taka ákvarðanir án aðstoðar annarra',
          icfCode: 'd177',
        },
        {
          questionCode: '3244CE4867202E62E0631F72040A8546',
          title: 'Inna af hendi stakt viðfangsefni',
          description:
            'Að byrja á og klára stakt og/eða einfalt verkefni (t.d. lesa bók, skrifa bréf, búa um rúm o.s.frv.)',
          icfCode: 'd210',
        },
        {
          questionCode: '3244CE4867212E62E0631F72040A8546',
          title: 'Inna af hendi mörg viðfangsefni',
          description:
            'Að skipuleggja og framkvæma mörg verkefni í einu, samtímis eða hvert á eftir öðru',
          icfCode: 'd220',
        },
        {
          questionCode: '3244CE4867222E62E0631F72040A8546',
          title: 'Fylgja dagskipulagi',
          description:
            'Að halda þig við áætlað dagskipulag (t.d. vakna, klæða þig, borða morgunmat, fara í vinnu/skóla o.s.frv.)',
          icfCode: 'd230',
        },
        {
          questionCode: '3244CE4867232E62E0631F72040A8546',
          title: 'Takast á við streitu og annað andlegt álag',
          description: 'Að takast á við streitu, ábyrgð og annað andlegt álag',
          icfCode: 'd240',
        },
        {
          questionCode: '3244CE4867242E62E0631F72040A8546',
          title: 'Skilja talað mál / táknmál',
          description: 'Að skilja talað mál eða tjáningu á táknmáli',
          icfCode: 'd310/20',
        },
        {
          questionCode: '3244CE4867252E62E0631F72040A8546',
          title: 'Skilja tjáningu án orða',
          description:
            'Að skilja tjáningu án orða/án táknmáls (t.d. líkamstjáningu eða teikningar)',
          icfCode: 'd315',
        },
        {
          questionCode: '3244CE4867262E62E0631F72040A8546',
          title: 'Tala /nota samskiptatæki og/eða tækni',
          description: 'Að tjá þig á skiljanlegan hátt í tali eða táknmáli',
          icfCode: 'd330/40',
        },
        {
          questionCode: '3244CE4867272E62E0631F72040A8546',
          title: 'Breyta grunnlíkamsstöðu',
          description:
            'Að breyta líkamsstöðu þinni (t.d. að standa upp úr stól, setjast niður, beygja þig o.s.frv.)',
          icfCode: 'd410',
        },
        {
          questionCode: '3244CE4867282E62E0631F72040A8546',
          title: 'Vera í líkamsstöðu',
          description:
            'Að vera í sömu líkamsstöðu í lengri tíma án verkja (t.d. að sitja, standa eða liggja)',
          icfCode: 'd415',
        },
        {
          questionCode: '3244CE4867292E62E0631F72040A8546',
          title: 'Lyfta og bera hluti',
          description:
            'Að lyfta hlutum og bera þá frá einum stað til annars (t.d. lyfta bolla, halda á kassa eða barni á milli herbergja)',
          icfCode: 'd430',
        },
        {
          questionCode: '3244CE48672A2E62E0631F72040A8546',
          title: 'Fínhreyfivinna',
          description:
            'Að nota hendur og fingur til að handleika hluti (t.d. að taka upp smáhlut, hneppa hnöppum, skrifa, hringja í síma, opna hurðarhún eða handleika lykla)',
          icfCode: 'd440',
        },
        {
          questionCode: '3244CE48672B2E62E0631F72040A8546',
          title: 'Ganga stuttar vegalengdir (< kílómeter)',
          description:
            'Að ganga stuttar vegalengdir (t.d. á göngum innanhúss eða ganga stuttar vegalengdir utandyra)',
          icfCode: 'd4500',
        },
        {
          questionCode: '3244CE48672C2E62E0631F72040A8546',
          title: 'Fara um með aðstoð tækja',
          description:
            'Að fara um með aðstoð hjálpartækja (t.d. að nota göngugrind, hækjur, hjólastól eða annan útbúnað sem auðveldar hreyfingu)',
          icfCode: 'd465',
        },
        {
          questionCode: '3244CE48672D2E62E0631F72040A8546',
          title: 'Nota farartæki',
          description:
            'Að nota farartæki sem farþegi (t.d. að fara inn og út úr bíl eða nota almenningssamgöngur, svo sem strætó)',
          icfCode: 'd470',
        },
        {
          questionCode: '3244CE48672E2E62E0631F72040A8546',
          title: 'Þvo sér',
          description:
            'Að þvo þér (t.d. að þvo hendur og andlit, fara í sturtu eða bað, þvo hár)',
          icfCode: 'd510',
        },
        {
          questionCode: '3244CE48672F2E62E0631F72040A8546',
          title: 'Fara á salerni',
          description:
            'Að nota salerni (t.d. að komast á klósett, stjórna þvaglátum og hægðalosun)',
          icfCode: 'd530',
        },
        {
          questionCode: '3244CE4867302E62E0631F72040A8546',
          title: 'Klæðast og afklæðast',
          description:
            'Að klæða þig í og úr (t.d. að fara í skyrtu, buxur eða skó, hneppa eða reima)',
          icfCode: 'd540',
        },
        {
          questionCode: '3244CE4867312E62E0631F72040A8546',
          title: 'Nærast (Matast og drekka)',
          description: 'Að borða og/eða drekka',
          icfCode: 'd550/60',
        },
        {
          questionCode: '3244CE4867322E62E0631F72040A8546',
          title: 'Grunnsamskipti',
          description:
            'Að eiga í samskiptum við annað fólk (t.d. skilja og bregðast við hegðun og tilfinningum annarra)',
          icfCode: 'd710',
        },
        {
          questionCode: '3244CE4867332E62E0631F72040A8546',
          title: 'Flókin samskipti',
          description:
            'Að sýna viðeigandi hegðun í flóknum samskiptum (t.d. halda samræðum gangandi, hafa stjórn á tilfinningum í samskiptum, sýna félagslega hæfni o.s.frv.)',
          icfCode: 'd720',
        },
        {
          questionCode: '3244CE4867342E62E0631F72040A8546',
          title: 'Formleg tengsl',
          description:
            'Að eiga í formlegum samskiptum (t.d. við kennara, yfirmenn, samstarfsfólk o.s.frv.)',
          icfCode: 'd740',
        },
        {
          questionCode: '3244CE4867352E62E0631F72040A8546',
          title: 'Starfsþjálfun',
          description:
            'Að undirbúa þig og taka þátt í þjálfun fyrir starf (t.d. vinna verk sem krafist er af í verknámi, námssamningi o.s.frv.)',
          icfCode: 'd840',
        },
        {
          questionCode: '3244CE4867362E62E0631F72040A8546',
          title: 'Finna, halda og ljúka starfi',
          description:
            'Að finna, halda og ljúka launuðu starfi eða sjálfboðavinnu',
          icfCode: 'd845',
        },
        {
          questionCode: '3244CE4867372E62E0631F72040A8546',
          title: 'Launuð störf',
          description:
            'Að sinna launuðu starfi (t.d. að mæta á réttum tíma, vinna verkefnin sem tilheyra starfinu, vinna sjálfstætt eða í hópi og fylgja leiðsögn)',
          icfCode: 'd850',
        },
        {
          questionCode: '3244CE4867382E62E0631F72040A8546',
          title: 'Efnahagslegt sjálfstæði',
          description:
            'Að stýra eigin fjármálum og tryggja fjárhagslegt öryggi þitt',
          icfCode: 'd870',
        },
      ],
    }
  }
}

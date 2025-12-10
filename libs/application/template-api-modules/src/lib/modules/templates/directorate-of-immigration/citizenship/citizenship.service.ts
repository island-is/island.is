import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { AttachmentS3Service } from '../../../shared/services'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import {
  ApplicantChildCustodyInformation,
  ApplicationTypes,
  ApplicationWithAttachments,
  NationalRegistryBirthplace,
  NationalRegistryIndividual,
  NationalRegistryResidenceHistory,
  NationalRegistrySpouseV3,
} from '@island.is/application/types'
import { TemplateApiError } from '@island.is/nest/problem'
import {
  CitizenshipAnswers,
  error as errorMessages,
} from '@island.is/application/templates/directorate-of-immigration/citizenship'
import {
  ApplicantResidenceConditionViewModel,
  CitizenshipValidity,
  CountryOfResidenceViewModel,
  DirectorateOfImmigrationClient,
  ResidenceAbroadViewModel,
  TravelDocumentViewModel,
} from '@island.is/clients/directorate-of-immigration'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import { YES } from '@island.is/application/core'
import { Auth } from '@island.is/auth-nest-tools'
import { ApplicantInformation } from './types'
import { NationalRegistryV3ApplicationsClientService } from '@island.is/clients/national-registry-v3-applications'

@Injectable()
export class CitizenshipService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly attachmentService: AttachmentS3Service,
    private readonly directorateOfImmigrationClient: DirectorateOfImmigrationClient,
    private readonly nationalRegistryApi: NationalRegistryClientService,
    private readonly nationalRegistryV3Api: NationalRegistryV3ApplicationsClientService,
  ) {
    super(ApplicationTypes.CITIZENSHIP)
  }

  async getResidenceConditionInfo(
    auth: Auth,
  ): Promise<ApplicantResidenceConditionViewModel> {
    return this.directorateOfImmigrationClient.getCitizenshipResidenceConditionInfo(
      auth,
    )
  }

  async getCurrentStayAbroadList(
    auth: Auth,
  ): Promise<ResidenceAbroadViewModel[]> {
    return this.directorateOfImmigrationClient.getCurrentStayAbroadList(auth)
  }

  async getCurrentPassportItem(
    auth: Auth,
  ): Promise<TravelDocumentViewModel | undefined> {
    return this.directorateOfImmigrationClient.getCurrentPassportItem(auth)
  }

  async getCurrentCountryOfResidenceList(
    auth: Auth,
  ): Promise<CountryOfResidenceViewModel[]> {
    return this.directorateOfImmigrationClient.getCurrentCountryOfResidenceList(
      auth,
    )
  }

  async getApplicantValidity(auth: Auth): Promise<CitizenshipValidity> {
    return this.directorateOfImmigrationClient.getApplicantValidity(auth)
  }

  async getApplicantInformation({
    auth,
  }: TemplateApiModuleActionProps): Promise<ApplicantInformation> {
    const validApplicant = await this.getApplicantValidity(auth)
    const validOptions = []

    for (const [key, value] of Object.entries(validApplicant)) {
      if (value) {
        validOptions.push(key)
      }
    }

    if (validOptions.length === 0) {
      throw new TemplateApiError(
        {
          title: errorMessages.applicationConditionsNotMet,
          summary: errorMessages.applicationConditionsNotMet,
        },
        400,
      )
    }

    const applicantInformationItem: ApplicantInformation = {}

    if (validApplicant.applicantExists === true) {
      const [
        countryOfResidenceList,
        passportItem,
        staysAbroadList,
        residenceConditionInfo,
      ] = await Promise.all([
        this.getCurrentCountryOfResidenceList(auth),
        this.getCurrentPassportItem(auth),
        this.getCurrentStayAbroadList(auth),
        this.getResidenceConditionInfo(auth),
      ])

      applicantInformationItem.currentCountryOfResidenceList =
        countryOfResidenceList
      applicantInformationItem.currentPassportItem = passportItem
      applicantInformationItem.currentStaysAbroadList = staysAbroadList
      applicantInformationItem.residenceConditionInfo = residenceConditionInfo
    } else {
      applicantInformationItem.eesNordicCitizen =
        validApplicant.eesNordicCitizen
      applicantInformationItem.eesResidenceCondition =
        validApplicant.eesResidenceCondition
      applicantInformationItem.spouseIsCitizen = validApplicant.spouseIsCitizen
    }

    return applicantInformationItem
  }

  async getResidenceInIcelandLastChangeDate({
    auth,
  }: TemplateApiModuleActionProps): Promise<Date | null> {
    // get residence history
    const residenceHistory: NationalRegistryResidenceHistory[] | null =
      await this.nationalRegistryV3Api.getResidenceHistory(
        auth.nationalId,
        auth,
      )

    if (!residenceHistory) return null

    // sort residence history so newest items are first, and if two items have the same date,
    // then the Iceland item will be first
    const countryIceland = 'IS'
    const sortedResidenceHistory = residenceHistory
      .filter((x) => x.dateOfChange)
      .sort((a, b) =>
        a.dateOfChange && b.dateOfChange && a.dateOfChange !== b.dateOfChange
          ? a.dateOfChange > b.dateOfChange
            ? -1
            : 1
          : a.country === countryIceland
          ? -1
          : 1,
      )

    // get the oldest change date for Iceland, where user did not move to another
    // country in between
    let lastChangeDate: Date | null = null
    for (let i = 0; i < sortedResidenceHistory.length; i++) {
      if (sortedResidenceHistory[i].country === countryIceland) {
        lastChangeDate = sortedResidenceHistory[i].dateOfChange
      } else {
        break
      }
    }

    return lastChangeDate
  }

  async validateApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const validApplicant = await this.getApplicantValidity(auth)
    const validOptions = []

    for (const [key, value] of Object.entries(validApplicant)) {
      if (value) {
        validOptions.push(key)
      }
    }

    if (validOptions.length === 0) {
      throw new TemplateApiError(
        {
          title: errorMessages.applicationConditionsNotMet,
          summary: errorMessages.applicationConditionsNotMet,
        },
        400,
      )
    }
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const { paymentUrl } = application.externalData.createCharge.data as {
      paymentUrl: string
    }
    if (!paymentUrl) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const isPayment: { fulfilled: boolean } | undefined =
      await this.sharedTemplateAPIService.getPaymentStatus(application.id)

    if (!isPayment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const answers = application.answers as CitizenshipAnswers

    const individual = application.externalData.individual?.data as
      | NationalRegistryIndividual
      | undefined
    const residenceInIcelandLastChangeDate = application.externalData
      .residenceInIcelandLastChangeDate?.data as Date | null
    const nationalRegistryBirthplace = application.externalData.birthplace
      ?.data as NationalRegistryBirthplace | undefined
    const spouseDetails = application.externalData.spouseDetails?.data as
      | NationalRegistrySpouseV3
      | undefined
    const childrenCustodyInformation = application.externalData
      .childrenCustodyInformation?.data as
      | ApplicantChildCustodyInformation[]
      | undefined
    const applicantPassport = answers.passport
    const filteredCountriesOfResidence =
      answers.countriesOfResidence?.hasLivedAbroad == YES &&
      answers.countriesOfResidence?.selectedAbroadCountries
        ?.filter((c) => c.wasRemoved !== 'true')
        ?.map((c) => ({
          countryId: c.countryId,
          dateFrom: c.dateFrom ? new Date(c.dateFrom) : undefined,
          dateTo: c.dateTo ? new Date(c.dateTo) : undefined,
        }))
    const filteredStaysAbroad =
      answers.staysAbroad?.hasStayedAbroad == YES &&
      answers.staysAbroad?.selectedAbroadCountries
        ?.filter((s) => s.wasRemoved !== 'true')
        ?.map((s) => ({
          countryId: s.countryId,
          dateFrom: s.dateFrom ? new Date(s.dateFrom) : undefined,
          dateTo: s.dateTo ? new Date(s.dateTo) : undefined,
          purpose: s.purpose,
        }))
    const filteredParents =
      answers.parentInformation?.hasValidParents == YES &&
      answers.parentInformation?.parents
        ?.filter((p) => p.nationalId && p.wasRemoved !== 'true')
        ?.map((p) => ({
          nationalId: p.nationalId || '',
          givenName:
            p.givenName || p.currentName.split(' ').slice(0, -1).join(' '),
          familyName: p.familyName || p.currentName.split(' ').pop(),
        }))

    // Get attachment array with countryId field from attachment array of arrays
    const applicantCriminalRecordAttachments = []
    const criminalRecordList = answers.supportingDocuments?.criminalRecord || []
    for (let i = 0; i < criminalRecordList.length; i++) {
      const countryId = criminalRecordList[i]?.countryId
      const attachments = criminalRecordList[i]?.attachment || []
      for (let j = 0; j < attachments.length; j++) {
        const attachment = attachments[j]
        if (countryId && attachment?.name && attachment?.key)
          applicantCriminalRecordAttachments.push({
            name: attachment.name,
            key: attachment.key,
            countryId,
          })
      }
    }
    const nonNullPassports = answers.childrenPassport?.filter((x) => !!x)

    // Submit the application
    await this.directorateOfImmigrationClient.submitApplicationForCitizenship(
      auth,
      {
        selectedChildren:
          answers.selectedChildren?.map((y) => {
            const childExtraInformation =
              answers.selectedChildrenExtraData?.find((z) => z.nationalId === y)

            if (!childExtraInformation) {
              throw new Error('Vantar upplýsingar um börn')
            }

            const childrenCustodyInformation = application.externalData
              .childrenCustodyInformation
              .data as ApplicantChildCustodyInformation[]

            const thisChild = childrenCustodyInformation.find(
              (x) => x.nationalId === childExtraInformation.nationalId,
            )

            return {
              nationalId: childExtraInformation.nationalId,
              otherParentNationalId:
                childExtraInformation.otherParentNationalId,
              otherParentBirtDate: childExtraInformation.otherParentBirtDate
                ? new Date(childExtraInformation.otherParentBirtDate)
                : undefined,
              otherParentName: childExtraInformation.otherParentName,
              citizenship: thisChild?.citizenship?.code || '',
            }
          }) || [],

        isFormerIcelandicCitizen: answers.formerIcelander === YES,
        givenName:
          individual?.givenName ||
          individual?.fullName.split(' ').slice(0, -1).join(' '), //if given name is not available then remove last name and return the rest of the name as the given name
        familyName:
          individual?.familyName || individual?.fullName.split(' ').pop(),
        fullName: individual?.fullName,
        address: individual?.address?.streetAddress,
        postalCode: individual?.address?.postalCode,
        city: individual?.address?.city,
        email: answers.userInformation?.email,
        phone: answers.userInformation?.phone,
        citizenshipCode: individual?.citizenship?.code,
        residenceInIcelandLastChangeDate: residenceInIcelandLastChangeDate,
        birthCountry: nationalRegistryBirthplace?.municipalityName,
        maritalStatus:
          spouseDetails?.maritalDescription ||
          individual?.maritalTitle?.description ||
          '',
        dateOfMaritalStatus: spouseDetails?.lastModified,
        spouse: spouseDetails?.nationalId
          ? {
              nationalId: spouseDetails.nationalId,
              name: spouseDetails.name,
              citizenshipCode: spouseDetails.citizenship?.code,
            }
          : undefined,
        parents: filteredParents || [],
        countriesOfResidence: filteredCountriesOfResidence || [],
        staysAbroad: filteredStaysAbroad || [],
        passport: {
          dateOfIssue: new Date(applicantPassport.publishDate),
          dateOfExpiry: new Date(applicantPassport.expirationDate),
          passportNumber: applicantPassport.passportNumber,
          passportTypeId: parseInt(applicantPassport.passportTypeId),
          countryOfIssuerId: applicantPassport.countryOfIssuerId,
          file: await this.getUrlForAttachment(
            application,
            answers?.passport?.attachment,
          ),
        },
        supportingDocuments: {
          birthCertificate: await this.getUrlForAttachment(
            application,
            answers?.supportingDocuments?.birthCertificate,
          ),
          subsistenceCertificate: await this.getUrlForAttachment(
            application,
            answers?.supportingDocuments?.subsistenceCertificate,
          ),
          subsistenceCertificateForTown: await this.getUrlForAttachment(
            application,
            answers?.supportingDocuments?.subsistenceCertificateForTown,
          ),
          certificateOfLegalResidenceHistory: await this.getUrlForAttachment(
            application,
            answers?.supportingDocuments?.certificateOfLegalResidenceHistory,
          ),
          icelandicTestCertificate: await this.getUrlForAttachment(
            application,
            answers?.supportingDocuments?.icelandicTestCertificate,
          ),
          criminalRecord: await this.getUrlForAttachment(
            application,
            applicantCriminalRecordAttachments,
          ),
        },
        children:
          childrenCustodyInformation?.map((c) => ({
            nationalId: c.nationalId,
            fullName: c.fullName,
            givenName: c.givenName,
            familyName: c.familyName,
          })) || [],
        childrenPassport: await Promise.all(
          nonNullPassports?.map(async (p) => ({
            nationalId: p?.nationalId ?? '',
            dateOfIssue: new Date(p?.publishDate ?? ''),
            dateOfExpiry: new Date(p?.expirationDate ?? ''),
            passportNumber: p?.passportNumber ?? '',
            passportTypeId: parseInt(p?.passportTypeId ?? ''),
            countryIdOfIssuer: p?.countryOfIssuerId ?? '',
            file: await this.getUrlForAttachment(application, p?.attachment),
          })) || [],
        ),
        childrenSupportingDocuments: await Promise.all(
          answers.childrenSupportingDocuments
            ?.filter((x) => !!x)
            .map(async (d) => ({
              nationalId: d?.nationalId || '',
              birthCertificate:
                (await this.getUrlForAttachment(
                  application,
                  d?.birthCertificate,
                )) || '',
              writtenConsentFromChild:
                (await this.getUrlForAttachment(
                  application,
                  d?.writtenConsentFromChild,
                )) || '',
              writtenConsentFromOtherParent:
                (await this.getUrlForAttachment(
                  application,
                  d?.writtenConsentFromOtherParent,
                )) || '',
              custodyDocuments:
                (await this.getUrlForAttachment(
                  application,
                  d?.custodyDocuments,
                )) || '',
            })) || [],
        ),
      },
    )
  }

  private async getUrlForAttachment(
    application: ApplicationWithAttachments,
    attachments?: { name: string; key: string; countryId?: string }[],
  ): Promise<{ filename: string; fileUrl: string; countryId: string }[]> {
    return await Promise.all(
      attachments?.map(async (file) => {
        const fileUrl = await this.attachmentService.getAttachmentUrl(
          application,
          file.key,
          300000,
        )
        return {
          filename: file.name,
          fileUrl,
          countryId: file.countryId || '',
        }
      }) || [],
    )
  }
}

import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import {
  ApplicantChildCustodyInformation,
  ApplicationTypes,
  ApplicationWithAttachments,
  NationalRegistryBirthplace,
  NationalRegistryIndividual,
  NationalRegistrySpouse,
} from '@island.is/application/types'
import { TemplateApiError } from '@island.is/nest/problem'
import {
  CitizenshipAnswers,
  error as errorMessages,
} from '@island.is/application/templates/directorate-of-immigration/citizenship'
import {
  ApplicantResidenceConditionViewModel,
  CountryOfResidenceViewModel,
  DirectorateOfImmigrationClient,
} from '@island.is/clients/directorate-of-immigration'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import { YES } from '@island.is/application/core'

@Injectable()
export class CitizenshipService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly directorateOfImmigrationClient: DirectorateOfImmigrationClient,
    private readonly nationalRegistryApi: NationalRegistryClientService,
  ) {
    super(ApplicationTypes.CITIZENSHIP)
  }

  async getResidenceConditionInfo({
    auth,
  }: TemplateApiModuleActionProps): Promise<ApplicantResidenceConditionViewModel> {
    return this.directorateOfImmigrationClient.getCitizenshipResidenceConditionInfo(
      auth,
    )
  }

  async getCurrentCountryOfResidenceList({
    auth,
  }: TemplateApiModuleActionProps): Promise<CountryOfResidenceViewModel[]> {
    return this.directorateOfImmigrationClient.getCurrentCountryOfResidenceList(
      auth,
    )
  }

  async getResidenceInIcelandLastChangeDate({
    auth,
  }: TemplateApiModuleActionProps): Promise<Date | null> {
    // get residence history
    const residenceHistory = await this.nationalRegistryApi.getResidenceHistory(
      auth.nationalId,
    )

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

    // if (!lastChangeDate) {
    //   throw new TemplateApiError(
    //     {
    //       title: errorMessages.residenceInIcelandLastChangeDateMissing,
    //       summary: errorMessages.residenceInIcelandLastChangeDateMissing,
    //     },
    //     404,
    //   )
    // }

    return lastChangeDate
  }

  async validateApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const answers = application.answers as CitizenshipAnswers

    const residenceConditionInfo =
      await this.directorateOfImmigrationClient.getCitizenshipResidenceConditionInfo(
        auth,
      )

    // throw error in case the residence condition list changed since prerequisite step and
    // user does not fulfill any other condition
    if (
      !residenceConditionInfo.isAnyResConValid &&
      answers.parentInformation?.hasValidParents !== YES &&
      answers.formerIcelander !== YES
    ) {
      throw new TemplateApiError(
        {
          title: errorMessages.noResidenceConditionPossible,
          summary: errorMessages.noResidenceConditionPossible,
        },
        400,
      )
    }
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    //TODOx
    console.log('--------submitApplication')

    // const { paymentUrl } = application.externalData.createCharge.data as {
    //   paymentUrl: string
    // }
    // if (!paymentUrl) {
    //   throw new Error(
    //     'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
    //   )
    // }

    // const isPayment: { fulfilled: boolean } | undefined =
    //   await this.sharedTemplateAPIService.getPaymentStatus(auth, application.id)

    // if (!isPayment?.fulfilled) {
    //   throw new Error(
    //     'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
    //   )
    // }

    const answers = application.answers as CitizenshipAnswers

    const individual = application.externalData.individual?.data as
      | NationalRegistryIndividual
      | undefined
    const residenceInIcelandLastChangeDate = application.externalData
      .residenceInIcelandLastChangeDate?.data as Date | null
    const nationalRegistryBirthplace = application.externalData
      .nationalRegistryBirthplace?.data as
      | NationalRegistryBirthplace
      | undefined
    const spouseDetails = application.externalData.spouseDetails?.data as
      | NationalRegistrySpouse
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
          givenName: p.givenName,
          familyName: p.familyName,
        }))

    // Get attachment array with countryId field from attachment array of arrays
    const applicantCriminalRecordAttachments = []
    const criminalRecordList = answers.supportingDocuments?.criminalRecord || []
    for (let i = 0; i < criminalRecordList.length; i++) {
      const countryId = i.toString()
      const attachments = criminalRecordList[i]?.attachment || []
      for (let j = 0; j < attachments.length; j++) {
        applicantCriminalRecordAttachments.push({
          ...attachments[j],
          countryId,
        })
      }
    }

    // Submit the application
    await this.directorateOfImmigrationClient.submitApplicationForCitizenship(
      auth,
      {
        selectedChildren:
          answers.selectedChildrenExtraData?.map((c) => ({
            nationalId: c.nationalId,
            otherParentNationalId: c.otherParentNationalId,
            otherParentBirtDate: c.otherParentBirtDate
              ? new Date(c.otherParentBirtDate)
              : undefined,
            otherParentName: c.otherParentName,
          })) || [],
        isFormerIcelandicCitizen: answers.formerIcelander === YES,
        givenName: individual?.givenName,
        familyName: individual?.familyName,
        fullName: individual?.fullName,
        address: individual?.address?.streetAddress,
        postalCode: individual?.address?.postalCode,
        city: individual?.address?.city,
        email: answers.userInformation?.email,
        phone: answers.userInformation?.phone,
        citizenshipCode: individual?.citizenship?.code,
        residenceInIcelandLastChangeDate: residenceInIcelandLastChangeDate,
        birthCountry: nationalRegistryBirthplace?.location,
        maritalStatusCode: spouseDetails?.maritalStatus,
        dateOfMaritalStatus: spouseDetails?.lastModified,
        spouse: spouseDetails?.nationalId
          ? {
              nationalId: spouseDetails.nationalId,
              name: spouseDetails.name,
              birthCountry: spouseDetails.birthplace?.location,
              citizenshipCode: spouseDetails.citizenship?.code,
              address: spouseDetails.address?.streetAddress,
              reasonDifferentAddress: answers.maritalStatus?.explanation,
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
          file: await this.getFilesFromAttachment(
            application,
            answers?.passport?.attachment,
          ),
        },
        supportingDocuments: {
          birthCertificate: await this.getFilesFromAttachment(
            application,
            answers?.supportingDocuments?.birthCertificate,
          ),
          subsistenceCertificate: await this.getFilesFromAttachment(
            application,
            answers?.supportingDocuments?.subsistenceCertificate,
          ),
          subsistenceCertificateForTown: await this.getFilesFromAttachment(
            application,
            answers?.supportingDocuments?.subsistenceCertificateForTown,
          ),
          certificateOfLegalResidenceHistory: await this.getFilesFromAttachment(
            application,
            answers?.supportingDocuments?.certificateOfLegalResidenceHistory,
          ),
          icelandicTestCertificate: await this.getFilesFromAttachment(
            application,
            answers?.supportingDocuments?.icelandicTestCertificate,
          ),
          criminalRecord: await this.getFilesFromAttachment(
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
          answers.childrenPassport?.map(async (p) => ({
            nationalId: p.nationalId,
            dateOfIssue: new Date(p.publishDate),
            dateOfExpiry: new Date(p.expirationDate),
            passportNumber: p.passportNumber,
            passportTypeId: parseInt(p.passportTypeId),
            countryIdOfIssuer: p.countryOfIssuerId,
            file: await this.getFilesFromAttachment(application, p.attachment),
          })) || [],
        ),
        childrenSupportingDocuments: await Promise.all(
          answers.childrenSupportingDocuments?.map(async (d) => ({
            nationalId: d.nationalId,
            birthCertificate: await this.getFilesFromAttachment(
              application,
              d.birthCertificate,
            ),
            writtenConsentFromChild: await this.getFilesFromAttachment(
              application,
              d.writtenConsentFromChild,
            ),
            writtenConsentFromOtherParent: await this.getFilesFromAttachment(
              application,
              d.writtenConsentFromOtherParent,
            ),
            custodyDocuments: await this.getFilesFromAttachment(
              application,
              d.custodyDocuments,
            ),
          })) || [],
        ),
      },
    )
  }

  private async getFilesFromAttachment(
    application: ApplicationWithAttachments,
    attachments?: { name: string; key: string; countryId?: string }[],
  ): Promise<{ filename: string; base64: string; countryId: string }[]> {
    return await Promise.all(
      attachments?.map(async (file) => {
        const base64 =
          await this.sharedTemplateAPIService.getAttachmentContentAsBase64(
            application,
            file.key,
          )
        return {
          filename: file.name,
          base64,
          countryId: file.countryId || '',
        }
      }) || [],
    )
  }
}

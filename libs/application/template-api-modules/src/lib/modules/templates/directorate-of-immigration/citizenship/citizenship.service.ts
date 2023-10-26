import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import {
  ApplicantChildCustodyInformation,
  ApplicationTypes,
  NationalRegistryBirthplace,
} from '@island.is/application/types'
import * as kennitala from 'kennitala'
import { TemplateApiError } from '@island.is/nest/problem'
import {
  CitizenshipAnswers,
  SpouseIndividual,
  CitizenIndividual,
  error as errorMessages,
} from '@island.is/application/templates/directorate-of-immigration/citizenship'
import {
  ApplicantResidenceConditionViewModel,
  CountryOfResidenceViewModel,
  DirectorateOfImmigrationClient,
  OptionSetItem,
  ResidenceAbroadViewModel,
  TravelDocumentViewModel,
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

  async getCountries(): Promise<OptionSetItem[]> {
    return this.directorateOfImmigrationClient.getCountries()
  }

  async getTravelDocumentTypes(): Promise<OptionSetItem[]> {
    return this.directorateOfImmigrationClient.getTravelDocumentTypes()
  }

  async getCurrentCountryOfResidenceList({
    auth,
  }: TemplateApiModuleActionProps): Promise<CountryOfResidenceViewModel[]> {
    return this.directorateOfImmigrationClient.getCurrentCountryOfResidenceList(
      auth,
    )
  }

  async getCurrentStayAbroadList({
    auth,
  }: TemplateApiModuleActionProps): Promise<ResidenceAbroadViewModel[]> {
    return this.directorateOfImmigrationClient.getCurrentStayAbroadList(auth)
  }

  async getCurrentPassportItem({
    auth,
  }: TemplateApiModuleActionProps): Promise<
    TravelDocumentViewModel | undefined
  > {
    return this.directorateOfImmigrationClient.getCurrentPassportItem(auth)
  }

  async getNationalRegistryIndividual({
    auth,
  }: TemplateApiModuleActionProps): Promise<CitizenIndividual | null> {
    const individual = await this.getIndividualDetails(auth.nationalId, true)
    if (individual)
      individual.residenceInIcelandLastChangeDate =
        await this.getResidenceInIcelandLastChangeDate(auth.nationalId)
    return individual
  }

  private async getIndividualDetails(
    nationalId: string,
    isApplicant: boolean,
  ): Promise<CitizenIndividual | null> {
    // get basic information about indiviual
    const person = await this.nationalRegistryApi.getIndividual(nationalId)

    // get information about indiviual citizenship
    const citizenship = await this.nationalRegistryApi.getCitizenship(
      nationalId,
    )

    // dont allow user to continue if already has icelandic citizenship
    const citizenshipIceland = 'IS'
    if (citizenship?.countryCode === citizenshipIceland && isApplicant) {
      throw new TemplateApiError(
        {
          title: errorMessages.alreadyIcelandicCitizen,
          summary: errorMessages.alreadyIcelandicCitizen,
        },
        404,
      )
    }

    // get marital title
    const cohabitationInfo = await this.nationalRegistryApi.getCohabitationInfo(
      nationalId,
    )
    const genderCodeValue =
      person && cohabitationInfo
        ? await this.nationalRegistryApi.getCohabitionCodeValue(
            cohabitationInfo?.cohabitationCode,
            person?.genderCode,
          )
        : null

    return (
      person && {
        nationalId: person.nationalId,
        givenName: person.givenName,
        familyName: person.familyName,
        fullName: person.name,
        age: kennitala.info(person.nationalId).age,
        citizenship: citizenship && {
          code: citizenship.countryCode,
          name: citizenship.countryName,
        },
        address: person.legalDomicile && {
          streetAddress: person.legalDomicile.streetAddress,
          postalCode: person.legalDomicile.postalCode,
          locality: person.legalDomicile.locality,
          city: person.legalDomicile.locality,
          municipalityCode: person.legalDomicile.municipalityNumber,
        },
        genderCode: person.genderCode,
        maritalTitle: {
          code: genderCodeValue?.code,
          description: genderCodeValue?.description,
        },
      }
    )
  }

  private async getResidenceInIcelandLastChangeDate(
    nationalId: string,
  ): Promise<Date | null> {
    // get residence history
    const residenceHistory = await this.nationalRegistryApi.getResidenceHistory(
      nationalId,
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

    return lastChangeDate
  }

  async getNationalRegistrySpouseDetails({
    auth,
  }: TemplateApiModuleActionProps): Promise<SpouseIndividual | null> {
    const { nationalId } = auth

    // get cohabitation information
    const cohabitationInfo = await this.nationalRegistryApi.getCohabitationInfo(
      nationalId,
    )

    return cohabitationInfo?.spouseNationalId
      ? {
          nationalId: cohabitationInfo.spouseNationalId,
          name: cohabitationInfo.spouseName,
          maritalStatus: cohabitationInfo.cohabitationCode,
          lastModified: cohabitationInfo.lastModified,
          spouseBirthplace: await this.getBirthplace(
            cohabitationInfo.spouseNationalId,
          ),
          spouse: await this.getIndividualDetails(
            cohabitationInfo.spouseNationalId,
            false,
          ),
        }
      : null
  }

  private async getBirthplace(
    nationalId: string,
  ): Promise<NationalRegistryBirthplace | null> {
    const birthplace = await this.nationalRegistryApi.getBirthplace(nationalId)

    return (
      birthplace && {
        dateOfBirth: birthplace.birthdate,
        location: birthplace.locality,
        municipalityCode: birthplace.municipalityNumber,
      }
    )
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
    const { paymentUrl } = application.externalData.createCharge.data as {
      paymentUrl: string
    }
    if (!paymentUrl) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const isPayment: { fulfilled: boolean } | undefined =
      await this.sharedTemplateAPIService.getPaymentStatus(auth, application.id)

    if (!isPayment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const answers = application.answers as CitizenshipAnswers
    const individual = application.externalData.individual?.data as
      | CitizenIndividual
      | undefined
    const nationalRegistryBirthplace = application.externalData
      .nationalRegistryBirthplace?.data as
      | NationalRegistryBirthplace
      | undefined
    const spouseDetails = application.externalData.spouseDetails?.data as
      | SpouseIndividual
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
    const criminalRecordListFlattened = []
    const criminalRecordList =
      answers.supportingDocuments?.criminalRecordList || []
    for (let i = 0; i < criminalRecordList.length; i++) {
      const countryId = criminalRecordList[i].countryId
      if (countryId) {
        const fileList = criminalRecordList[i].file || []
        for (let j = 0; j < fileList.length; j++) {
          criminalRecordListFlattened.push({
            countryId: countryId,
            filename: fileList[j].filename,
            base64: fileList[j].base64,
          })
        }
      }
    }

    if (!applicantPassport) {
      throw new Error('Ekki er búið að skrá upplýsingar um vegabréf umsækjanda')
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
        residenceInIcelandLastChangeDate:
          individual?.residenceInIcelandLastChangeDate,
        birthCountry: nationalRegistryBirthplace?.location,
        maritalStatusCode: spouseDetails?.maritalStatus,
        dateOfMaritalStatus: spouseDetails?.lastModified,
        spouse: spouseDetails?.nationalId
          ? {
              nationalId: spouseDetails.nationalId || '',
              givenName: spouseDetails.spouse?.givenName,
              familyName: spouseDetails.spouse?.familyName,
              birthCountry: spouseDetails.spouseBirthplace?.location,
              citizenshipCode: spouseDetails.spouse?.citizenship?.code,
              address: spouseDetails.spouse?.address?.streetAddress,
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
          file:
            applicantPassport.file?.map((file) => ({
              filename: file.filename,
              base64: file.base64,
            })) || [],
        },
        supportingDocuments: {
          birthCertificate: answers.supportingDocuments?.birthCertificate?.map(
            (file) => ({ filename: file.filename, base64: file.base64 }),
          ),
          subsistenceCertificate:
            answers.supportingDocuments?.subsistenceCertificate?.map(
              (file) => ({
                filename: file.filename,
                base64: file.base64,
              }),
            ) || [],
          subsistenceCertificateForTown:
            answers.supportingDocuments?.subsistenceCertificateForTown?.map(
              (file) => ({ filename: file.filename, base64: file.base64 }),
            ) || [],
          certificateOfLegalResidenceHistory:
            answers.supportingDocuments?.certificateOfLegalResidenceHistory?.map(
              (file) => ({ filename: file.filename, base64: file.base64 }),
            ) || [],
          icelandicTestCertificate:
            answers.supportingDocuments?.icelandicTestCertificate?.map(
              (file) => ({
                filename: file.filename,
                base64: file.base64,
              }),
            ) || [],
          criminalRecordList: criminalRecordListFlattened,
        },
        children:
          childrenCustodyInformation?.map((c) => ({
            nationalId: c.nationalId,
            fullName: c.fullName,
            givenName: c.givenName,
            familyName: c.familyName,
          })) || [],
        childrenPassport:
          answers.childrenPassport?.map((p) => ({
            nationalId: p.nationalId,
            dateOfIssue: new Date(p.publishDate),
            dateOfExpiry: new Date(p.expirationDate),
            passportNumber: p.passportNumber,
            passportTypeId: parseInt(p.passportTypeId),
            countryIdOfIssuer: p.countryOfIssuerId,
            file:
              p.file?.map((file) => ({
                filename: file.filename,
                base64: file.base64,
              })) || [],
          })) || [],
        childrenSupportingDocuments:
          answers.childrenSupportingDocuments?.map((d) => ({
            nationalId: d.nationalId,
            birthCertificate:
              d.birthCertificate?.map((file) => ({
                filename: file.filename,
                base64: file.base64,
              })) || [],
            writtenConsentFromChild:
              d.writtenConsentFromChild?.map((file) => ({
                filename: file.filename,
                base64: file.base64,
              })) || [],
            writtenConsentFromOtherParent:
              d.writtenConsentFromOtherParent?.map((file) => ({
                filename: file.filename,
                base64: file.base64,
              })) || [],
            custodyDocuments:
              d.custodyDocuments?.map((file) => ({
                filename: file.filename,
                base64: file.base64,
              })) || [],
          })) || [],
      },
    )
  }
}

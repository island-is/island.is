import { Injectable } from '@nestjs/common'
import { SharedTemplateApiService } from '../../../shared'
import { TemplateApiModuleActionProps } from '../../../../types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import {
  ApplicantChildCustodyInformation,
  ApplicationTypes,
  InstitutionNationalIds,
  NationalRegistryBirthplace,
} from '@island.is/application/types'
import * as kennitala from 'kennitala'
import { TemplateApiError } from '@island.is/nest/problem'
import {
  getChargeItemCodes,
  CitizenshipAnswers,
  SpouseIndividual,
  CitizenIndividual,
} from '@island.is/application/templates/directorate-of-immigration/citizenship'
import {
  CitizenshipClient,
  Country,
  CountryOfResidence,
  ForeignCriminalRecordFile,
  Passport,
  ResidenceCondition,
  StayAbroad,
  TravelDocumentType,
} from '@island.is/clients/directorate-of-immigration/citizenship'
import { NationalRegistryClientService } from '@island.is/clients/national-registry-v2'
import { coreErrorMessages, YES } from '@island.is/application/core'

@Injectable()
export class CitizenshipService extends BaseTemplateApiService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly citizenshipClient: CitizenshipClient,
    private readonly nationalRegistryApi: NationalRegistryClientService,
  ) {
    super(ApplicationTypes.CITIZENSHIP)
  }

  async createCharge({ application, auth }: TemplateApiModuleActionProps) {
    try {
      const answers = application.answers as CitizenshipAnswers

      const chargeItemCodes = getChargeItemCodes(answers)

      const result = this.sharedTemplateAPIService.createCharge(
        auth,
        application.id,
        InstitutionNationalIds.UTLENDINGASTOFNUN,
        chargeItemCodes,
      )
      return result
    } catch (exeption) {
      return { id: '', paymentUrl: '' }
    }
  }

  async getResidenceConditions({
    auth,
  }: TemplateApiModuleActionProps): Promise<ResidenceCondition[]> {
    return this.citizenshipClient.getResidenceConditions(auth)
  }

  async getCountries(): Promise<Country[]> {
    return this.citizenshipClient.getCountries()
  }

  async getTravelDocumentTypes(): Promise<TravelDocumentType[]> {
    return this.citizenshipClient.getTravelDocumentTypes()
  }

  async getOldCountryOfResidenceList({
    auth,
  }: TemplateApiModuleActionProps): Promise<CountryOfResidence[]> {
    return this.citizenshipClient.getOldCountryOfResidenceList(auth)
  }

  async getOldStayAbroadList({
    auth,
  }: TemplateApiModuleActionProps): Promise<StayAbroad[]> {
    return this.citizenshipClient.getOldStayAbroadList(auth)
  }

  async getOldPassportItem({
    auth,
  }: TemplateApiModuleActionProps): Promise<Passport | undefined> {
    return this.citizenshipClient.getOldPassportItem(auth)
  }

  async getOldForeignCriminalRecordFileList({
    auth,
  }: TemplateApiModuleActionProps): Promise<ForeignCriminalRecordFile[]> {
    return this.citizenshipClient.getOldForeignCriminalRecordFileList(auth)
  }

  async getNationalRegistryIndividual({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<CitizenIndividual | null> {
    const individual = await this.getIndividualDetails(auth.nationalId)
    if (individual)
      individual.residenceInIcelandLastChangeDate = await this.getResidenceInIcelandLastChangeDate(
        auth.nationalId,
      )
    return individual
  }

  private async getIndividualDetails(
    nationalId: string,
  ): Promise<CitizenIndividual | null> {
    // get basic information about indiviual
    const person = await this.nationalRegistryApi.getIndividual(nationalId)

    // get information about indiviual citizenship
    const citizenship = await this.nationalRegistryApi.getCitizenship(
      nationalId,
    )

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
        a.dateOfChange !== b.dateOfChange
          ? a.dateOfChange! > b.dateOfChange!
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

    //TODOx remove, need to check if this is reliable information
    if (!lastChangeDate) return new Date()

    return lastChangeDate
  }

  async getNationalRegistrySpouseDetails({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<SpouseIndividual | null> {
    const { nationalId } = auth

    // get cohabitation information
    const cohabitationInfo = await this.nationalRegistryApi.getCohabitationInfo(
      nationalId,
    )

    // get spouse's birthplace
    const spouseBirthplace =
      cohabitationInfo &&
      (await this.getBirthplace(cohabitationInfo.spouseNationalId))

    return (
      cohabitationInfo && {
        nationalId: cohabitationInfo.spouseNationalId,
        name: cohabitationInfo.spouseName,
        maritalStatus: cohabitationInfo.cohabitationCode,
        lastModified:
          cohabitationInfo.lastModified && cohabitationInfo.lastModified,
        spouseBirthplace: spouseBirthplace,
        spouse: await this.getIndividualDetails(
          cohabitationInfo.spouseNationalId,
        ),
      }
    )
  }

  private async getBirthplace(
    nationalId: string,
  ): Promise<NationalRegistryBirthplace | null> {
    const birthplace = await this.nationalRegistryApi.getBirthplace(nationalId)

    if (!birthplace?.locality) {
      throw new TemplateApiError(
        {
          title: coreErrorMessages.nationalRegistryBirthplaceMissing,
          summary: coreErrorMessages.nationalRegistryBirthplaceMissing,
        },
        404,
      )
    }

    return (
      birthplace && {
        dateOfBirth: birthplace.birthdate,
        location: birthplace.locality,
        municipalityCode: birthplace.municipalityNumber,
      }
    )
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

    const isPayment:
      | { fulfilled: boolean }
      | undefined = await this.sharedTemplateAPIService.getPaymentStatus(
      auth,
      application.id,
    )

    if (!isPayment?.fulfilled) {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }

    const answers = application.answers as CitizenshipAnswers
    const individual = application.externalData.individual.data as
      | CitizenIndividual
      | undefined
    const nationalRegistryBirthplace = application.externalData
      .nationalRegistryBirthplace.data as NationalRegistryBirthplace | undefined
    const childrenCustodyInformation = application.externalData
      .childrenCustodyInformation.data as
      | ApplicantChildCustodyInformation[]
      | undefined
    const spouseDetails = application.externalData.spouseDetails.data as
      | SpouseIndividual
      | undefined
    const applicantPassport = answers.passports?.find(
      (p) => p.nationalId === application.applicant,
    )?.passport

    if (!applicantPassport) {
      throw new Error('Ekki er búið að skrá upplýsingar um vegabréf umsækjanda')
    }

    // Submit the application
    await this.citizenshipClient.submitApplicationForCitizenship(auth, {
      selectedChildren: answers.selectedChildren || [],
      isFormerIcelandicCitizen: answers.formerIcelander === YES,
      name: individual?.fullName,
      address: individual?.address?.streetAddress,
      postalCode: individual?.address?.postalCode,
      email: answers.userInformation?.email,
      phone: answers.userInformation?.phone,
      citizenshipCode: individual?.citizenship?.code,
      residenceInIcelandLastChangeDate:
        individual?.residenceInIcelandLastChangeDate,
      birthCountry: nationalRegistryBirthplace?.location,
      children:
        childrenCustodyInformation?.map((c) => ({
          nationalId: c.nationalId,
          name: c.fullName,
          citizenshipCode: c.citizenship?.code,
        })) || [],
      maritalStatusCode: spouseDetails?.maritalStatus,
      dateOfMaritalStatus: spouseDetails?.lastModified,
      spouse: spouseDetails?.nationalId
        ? {
            nationalId: spouseDetails.nationalId!,
            name: spouseDetails.name!,
            birthCountry: spouseDetails.spouseBirthplace?.location,
            citizenshipCode: spouseDetails.spouse?.citizenship?.code,
            address: spouseDetails.spouse?.address?.streetAddress,
            reasonDifferentAddress: answers.maritalStatus?.explanation,
          }
        : undefined,
      parents:
        answers.parentInformation?.parents
          ?.filter((p) => p.nationalId)
          ?.map((p) => ({
            nationalId: p.nationalId!,
            name: p.name!,
          })) || [],
      countriesOfResidence:
        answers.countriesOfResidence?.selectedAbroadCountries?.map((c) => ({
          countryId: c.countryId,
        })) || [],
      staysAbroad:
        answers.staysAbroad?.selectedAbroadCountries?.map((s) => ({
          countryId: s.countryId,
          dateFrom: s.dateFrom ? new Date(s.dateFrom) : undefined,
          dateTo: s.dateTo ? new Date(s.dateTo) : undefined,
          purpose: s.purpose,
        })) || [],
      passport: {
        dateOfIssue: new Date(applicantPassport.publishDate),
        dateOfExpiry: new Date(applicantPassport.expirationDate),
        passportNumber: applicantPassport.passportNumber,
        passportTypeId: applicantPassport.passportTypeId,
        countryOfIssuerId: applicantPassport.countryOfIssuerId,
      },
      //TODOx missing in answers:
      supportingDocuments: {
        birthCertificate: { base64: '' },
        subsistenceCertificate: { base64: '' },
        subsistenceCertificateForTown: { base64: '' },
        certificateOfLegalResidenceHistory: { base64: '' },
        icelandicTestCertificate: { base64: '' },
        criminalRecordList: [{ countryId: 1, base64: '' }],
      },
      //TODOx missing in answers:
      childrenPassport: [
        {
          nationalId: '',
          dateOfIssue: new Date(),
          dateOfExpiry: new Date(),
          passportNumber: '',
          passportTypeId: 1,
          countryIdOfIssuer: 1,
        },
      ],
      //TODOx missing in answers:
      childrenSupportingDocuments: [
        {
          nationalId: '',
          birthCertificate: { base64: '' },
          writtenConsentFromChild: { base64: '' },
          writtenConsentFromOtherParent: { base64: '' },
          custodyDocuments: { base64: '' },
        },
      ],
    })
  }
}

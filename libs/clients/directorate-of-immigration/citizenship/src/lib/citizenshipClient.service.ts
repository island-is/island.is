import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  CitizenshipApplication,
  Country,
  CountryOfResidence,
  ForeignCriminalRecordFile,
  Passport,
  ResidenceCondition,
  StayAbroad,
  TravelDocumentType,
} from './citizenshipClient.types'
import { Inject, Injectable, Logger } from '@nestjs/common'
import {
  ApplicantResidenceConditionApi,
  ApplicationApi,
  ChildrenApi,
  CountryOfResidenceApi,
  LookupType,
  OptionSetApi,
  ParentApi,
  ResidenceAbroadApi,
  SpouseApi,
  TravelDocumentApi,
} from '../../gen/fetch'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { child } from 'winston'

@Injectable()
export class CitizenshipClient {
  constructor(
    private applicationApi: ApplicationApi,
    private childrenApi: ChildrenApi,
    private spouseApi: SpouseApi,
    private parentApi: ParentApi,
    private countryOfResidenceApi: CountryOfResidenceApi,
    private residenceAbroadApi: ResidenceAbroadApi,
    private travelDocumentApi: TravelDocumentApi,
    private applicantResidenceConditionApi: ApplicantResidenceConditionApi,
    private optionSetApi: OptionSetApi,

    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  private applicationApiWithAuth(auth: Auth) {
    return this.applicationApi.withMiddleware(new AuthMiddleware(auth))
  }

  private childrenApiWithAuth(auth: Auth) {
    return this.childrenApi.withMiddleware(new AuthMiddleware(auth))
  }

  private spouseApiWithAuth(auth: Auth) {
    return this.spouseApi.withMiddleware(new AuthMiddleware(auth))
  }

  private parentApiWithAuth(auth: Auth) {
    return this.parentApi.withMiddleware(new AuthMiddleware(auth))
  }

  private countryOfResidenceApiWithAuth(auth: Auth) {
    return this.countryOfResidenceApi.withMiddleware(new AuthMiddleware(auth))
  }

  private residenceAbroadApiWithAuth(auth: Auth) {
    return this.residenceAbroadApi.withMiddleware(new AuthMiddleware(auth))
  }

  private travelDocumentApiWithAuth(auth: Auth) {
    return this.travelDocumentApi.withMiddleware(new AuthMiddleware(auth))
  }

  private applicantResidenceConditionApiWithAuth(auth: Auth) {
    return this.applicantResidenceConditionApi.withMiddleware(
      new AuthMiddleware(auth),
    )
  }

  async getCountries(): Promise<Country[]> {
    try {
      const res = await this.optionSetApi.apiOptionSetLookupTypeGet({
        lookupType: LookupType.Countries,
      })

      return res.map((item) => ({
        id: item.id!,
        name: item.name!,
      }))
    } catch (error) {
      this.logger.error('Error when trying to get countries from UTL', error)
      throw new Error('Villa kom upp þegar reynt var að sækja lönd.')
    }
  }

  async getTravelDocumentTypes(): Promise<TravelDocumentType[]> {
    try {
      const res = await this.optionSetApi.apiOptionSetLookupTypeGet({
        lookupType: LookupType.TravelDocumentTypes,
      })

      return res.map((item) => ({
        id: item.id!,
        name: item.name!,
      }))
    } catch (error) {
      this.logger.error(
        'Error when trying to get travel document types from UTL',
        error,
      )
      throw new Error(
        'Villa kom upp þegar reynt var að sækja tegund vegabréfs.',
      )
    }
  }

  async getResidenceConditions(auth: Auth): Promise<ResidenceCondition[]> {
    try {
      const res = await this.applicantResidenceConditionApiWithAuth(
        auth,
      ).apiApplicantResidenceConditionGetAllGet()

      return res.map((item) => ({
        conditionId: item.residenceConditionId!,
        conditionName: item.residenceConditionName!,
        isTypeMaritalStatus: item.isTypeMarried || false,
      }))
    } catch (error) {
      this.logger.error(
        'Error when trying to get residence conditions from UTL',
        error,
      )
      throw new Error('Villa kom upp þegar reynt var að sækja búsetuskilyrði.')
    }
  }

  async getOldCountryOfResidenceList(
    auth: Auth,
  ): Promise<CountryOfResidence[]> {
    try {
      const res = await this.countryOfResidenceApiWithAuth(
        auth,
      ).apiCountryOfResidenceGetAllGet()

      return res.map((item) => ({
        countryId: item.countryId!,
        countryName: item.countryName!,
      }))
    } catch (error) {
      this.logger.error(
        'Error when trying to get old country of residence info from UTL',
        error,
      )
      throw new Error('Villa kom upp þegar reynt var að sækja búsetulönd.')
    }
  }

  async getOldStayAbroadList(auth: Auth): Promise<StayAbroad[]> {
    try {
      const res = await this.residenceAbroadApiWithAuth(
        auth,
      ).apiResidenceAbroadGetAllGet()

      return res.map((item) => ({
        countryId: item.countryId!,
        countryName: item.countryName!,
        dateFrom: item.dateFrom,
        dateTo: item.dateTo,
        purposeOfStay: item.purposeOfStay,
      }))
    } catch (error) {
      this.logger.error(
        'Error when trying to get old stay abroad info from UTL',
        error,
      )
      throw new Error('Villa kom upp þegar reynt var að sækja dvöl erlendis.')
    }
  }

  async getOldPassportItem(auth: Auth): Promise<Passport | undefined> {
    try {
      const res = await this.travelDocumentApiWithAuth(
        auth,
      ).apiTravelDocumentGetAllGet()

      //TODOx veljum bara fyrsta þangað til við fáum nýjan endapunkt sem skilar nýjasta/núverandi vegabréfi
      const firstRes = res[0]

      return (
        firstRes && {
          dateOfIssue: firstRes.dateOfIssue,
          dateOfExpiry: firstRes.dateOfExpiry,
          name: firstRes.name,
          passportNo: firstRes.travelDocumentNo,
          passportTypeId: firstRes.travelDocumentTypeId,
          passportTypeName: firstRes.travelDocumentTypeName,
          issuingCountryId: firstRes.issuingCountryId,
          issuingCountryName: firstRes.issuingCountryName,
        }
      )
    } catch (error) {
      this.logger.error(
        'Error when trying to get passport info from UTL',
        error,
      )
      throw new Error(
        'Villa kom upp þegar reynt var að sækja tegund vegabréfs.',
      )
    }
  }

  async getOldForeignCriminalRecordFileList(
    auth: Auth,
  ): Promise<ForeignCriminalRecordFile[]> {
    return [] // TODOx missing endpoint in API
  }

  async submitApplicationForCitizenship(
    auth: User,
    application: CitizenshipApplication,
  ): Promise<void> {
    // create application for applicant
    const applicationId = await this.applicationApiWithAuth(
      auth,
    ).apiApplicationPost({
      applicationNewModel: {
        caseTypeId: 30020,
        classificationId: null,
        classificationTypeId: null,
        classificationDetailId: null,
        // TODOx isFormerIcelandicCitizen: application.isFormerIcelandicCitizen,
      },
    })

    // submit basic information about applicant
    // TODOx missing endpoint
    // await this.applicationApiWithAuth(auth).post({
    //   name: application.name,
    //   address: application.address,
    //   postalCode: application.postalCode,
    //   email: application.email,
    //   phone: application.phone,
    //   citizenshipCode: application.citizenshipCode,
    //   residenceInIcelandLastChangeDate:
    //     application.residenceInIcelandLastChangeDate,
    //   birthCountry: application.birthCountry,
    // })

    // submit information about spouse
    await this.spouseApiWithAuth(auth).apiSpousePost({
      spouseNewModel: {
        maritalStatusId: 1, //TODOx er hægt að fá ID application.maritalStatusCode,
        dateOfMarriage: application.dateOfMaritalStatus,
        icelandicidIDNO: application.spouse?.nationalId,
        givenName: application.spouse?.name, //TODOx sleppa að splitta nafni
        surName: application.spouse?.name, //TODOx sleppa að splitta nafni
        applicantAddress: application.address,
        spouseAddress: application.spouse?.address,
        explanation: application.spouse?.reasonDifferentAddress,
        nationalityId: 1, //TODOx application.spouseCitizenshipCode,
      },
    })

    // submit information about parents with Icelandic citizenship
    const parents = application.parents
    for (let i = 0; i < parents.length; i++) {
      await this.parentApiWithAuth(auth).apiParentPost({
        parentNewModel: {
          icelandicIDNO: parents[i].nationalId,
          givenName: parents[i].name, //TODOx sleppa að splitta nafni
          surName: parents[i].name, //TODOx sleppa að splitta nafni
        },
      })
    }

    // submit information about countries of residence
    const countriesOfResidence = application.countriesOfResidence
    for (let i = 0; i < countriesOfResidence.length; i++) {
      await this.countryOfResidenceApiWithAuth(auth).apiCountryOfResidencePost({
        countryOfResidenceNewModel: {
          countryId: countriesOfResidence[i].countryId,
        },
      })
    }

    // submit information about stays abroad
    const staysAbroad = application.staysAbroad
    for (let i = 0; i < staysAbroad.length; i++) {
      await this.residenceAbroadApiWithAuth(auth).apiResidenceAbroadPost({
        residenceAbroadNewModel: {
          countryId: staysAbroad[i].countryId,
          dateFrom: staysAbroad[i].dateFrom,
          dateTo: staysAbroad[i].dateTo,
          purposeOfStay: staysAbroad[i].purpose,
        },
      })
    }

    // submit information about travel document (passport) for applicant
    await this.travelDocumentApiWithAuth(auth).apiTravelDocumentPost({
      travelDocumentNewModel: {
        dateOfExpiry: application.passport.dateOfExpiry,
        dateOfIssue: application.passport.dateOfIssue,
        issuingCountryId: application.passport.countryOfIssuerId,
        name: application.name,
        travelDocumentNo: application.passport.passportNumber,
        travelDocumentTypeId: application.passport.passportTypeId,
      },
    })

    // submit all other supporting documents for applicant
    //TODOx missing endpoint
    // await this.supportingDocumentsApiWithAuth(auth).post({
    //   birthCertificate:
    //     application.supportingDocuments.birthCertificate?.base64,
    //   subsistenceCertificate:
    //     application.supportingDocuments.subsistenceCertificate.base64,
    //   subsistenceCertificateForTown:
    //     application.supportingDocuments.subsistenceCertificateForTown.base64,
    //   certificateOfLegalResidenceHistory:
    //     application.supportingDocuments.certificateOfLegalResidenceHistory
    //       .base64,
    //   icelandicTestCertificate:
    //     application.supportingDocuments.icelandicTestCertificate.base64,
    //   criminalRecord: application.supportingDocuments.criminalRecordList.map(
    //     (x) => x.base64,
    //   ),
    // })

    // create application and submit information for selected children
    // TODOx missing endpoints for children
    // const selectedChildren = application.selectedChildren
    // for (let i = 0; i < selectedChildren.length; i++) {
    //   const childNationalId = selectedChildren[i]
    //   const child = application.children.find(
    //     (c) => c.nationalId === childNationalId,
    //   )

    //   // create application for child
    //   const childApplicationId = await this.applicationApiWithAuth(
    //     auth,
    //   ).apiApplicationPost({
    //     applicationNewModel: {
    //       // TODOx childNationalId: childNationalId
    //       caseTypeId: 30020,
    //       classificationId: null,
    //       classificationTypeId: null,
    //       classificationDetailId: null,
    //     },
    //   })

    //   // submit information about travel document (passport) for child
    //   const childPassport = application.childrenPassport.find(
    //     (c) => c.nationalId === childNationalId,
    //   )
    //   if (childPassport)
    //     await this.travelDocumentApiWithAuth(auth).apiTravelDocumentPost({
    //       travelDocumentNewModel: {
    //         // TODOx childNationalId: childNationalId
    //         dateOfExpiry: childPassport.dateOfExpiry,
    //         dateOfIssue: childPassport.dateOfIssue,
    //         issuingCountryId: childPassport.countryIdOfIssuer,
    //         name: child?.name,
    //         travelDocumentNo: childPassport.passportNumber,
    //         travelDocumentTypeId: childPassport.passportTypeId,
    //       },
    //     })

    //   // submit all other supporting documents for child
    //   //TODOx missing endpoint
    //   const childSupportingDocuments = application.childrenSupportingDocuments.find(
    //     (c) => c.nationalId === childNationalId,
    //   )
    //   if (childSupportingDocuments)
    //     await this.supportingDocumentsApiWithAuth(auth).post({
    //       // TODOx childNationalId: childNationalId
    //       birthCertificate: childSupportingDocuments.birthCertificate.base64,
    //       writtenConsentFromChild:
    //         childSupportingDocuments.writtenConsentFromChild?.base64,
    //       writtenConsentFromOtherParent:
    //         childSupportingDocuments.writtenConsentFromOtherParent?.base64,
    //       custodyDocuments: childSupportingDocuments.custodyDocuments.base64,
    //     })
    // }
  }
}

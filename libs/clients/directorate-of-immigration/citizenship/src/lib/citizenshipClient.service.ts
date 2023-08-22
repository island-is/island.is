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
  ApplicantApi,
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
    private applicantApi: ApplicantApi,
    private applicantResidenceConditionApi: ApplicantResidenceConditionApi,
    private applicationApi: ApplicationApi,
    private childrenApi: ChildrenApi,
    private countryOfResidenceApi: CountryOfResidenceApi,
    private optionSetApi: OptionSetApi,
    private parentApi: ParentApi,
    private residenceAbroadApi: ResidenceAbroadApi,
    private spouseApi: SpouseApi,
    private travelDocumentApi: TravelDocumentApi,

    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  private applicantApiWithAuth(auth: Auth) {
    return this.applicantApi.withMiddleware(new AuthMiddleware(auth))
  }

  private applicantResidenceConditionApiWithAuth(auth: Auth) {
    return this.applicantResidenceConditionApi.withMiddleware(
      new AuthMiddleware(auth),
    )
  }

  private applicationApiWithAuth(auth: Auth) {
    return this.applicationApi.withMiddleware(new AuthMiddleware(auth))
  }

  private childrenApiWithAuth(auth: Auth) {
    return this.childrenApi.withMiddleware(new AuthMiddleware(auth))
  }

  private countryOfResidenceApiWithAuth(auth: Auth) {
    return this.countryOfResidenceApi.withMiddleware(new AuthMiddleware(auth))
  }

  private parentApiWithAuth(auth: Auth) {
    return this.parentApi.withMiddleware(new AuthMiddleware(auth))
  }

  private residenceAbroadApiWithAuth(auth: Auth) {
    return this.residenceAbroadApi.withMiddleware(new AuthMiddleware(auth))
  }

  private spouseApiWithAuth(auth: Auth) {
    return this.spouseApi.withMiddleware(new AuthMiddleware(auth))
  }

  private travelDocumentApiWithAuth(auth: Auth) {
    return this.travelDocumentApi.withMiddleware(new AuthMiddleware(auth))
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
      //TODOx disabled while this endpoint is (unecessarily?) requiring applicationId
      // const res = await this.residenceAbroadApiWithAuth(
      //   auth,
      // ).apiResidenceAbroadGetAllApplicationIdGet({ applicationId: '' })

      // return res.map((item) => ({
      //   countryId: item.countryId!,
      //   countryName: item.countryName!,
      //   dateFrom: item.dateFrom,
      //   dateTo: item.dateTo,
      //   purposeOfStay: item.purposeOfStay,
      // }))
      return []
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
      //TODOx disabled while this endpoint is (unecessarily?) requiring applicationId
      // const res = await this.travelDocumentApiWithAuth(
      //   auth,
      // ).apiTravelDocumentGetAllApplicationIdGet({ applicationId: '' })

      // // Select the most recent entry
      // const newestItem = res.sort(
      //   (a, b) => (b.createdOn?.getTime() || 0) - (a.createdOn?.getTime() || 0),
      // )[0]

      // return (
      //   newestItem && {
      //     dateOfIssue: newestItem.dateOfIssue,
      //     dateOfExpiry: newestItem.dateOfExpiry,
      //     name: newestItem.name,
      //     passportNo: newestItem.travelDocumentNo,
      //     passportTypeId: newestItem.travelDocumentTypeId,
      //     passportTypeName: newestItem.travelDocumentTypeName,
      //     issuingCountryId: newestItem.issuingCountryId,
      //     issuingCountryName: newestItem.issuingCountryName,
      //   }
      // )
      return undefined
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
    return [] // TODOx missing endpoint for GET foreign criminal record
  }

  async submitApplicationForCitizenship(
    auth: User,
    application: CitizenshipApplication,
  ): Promise<void> {
    // create application for applicant
    const applicationId = await this.applicationApiWithAuth(
      auth,
    ).apiApplicationCitizenshipPost()

    // submit basic information about applicant
    // TODOx missing fields in POST applicant endpoint
    await this.applicantApiWithAuth(auth).applicantPost({
      applicantNewModel: {
        icelandicIDNO: auth.nationalId,
        givenName: application.givenName,
        surName: application.familyName,
        emailAddress: application.email,
        telephone: application.phone,
        // address: application.address,
        // postalCode: application.postalCode,
        addressCity: application.city,
        // citizenshipCode: application.citizenshipCode,
        // residenceInIcelandLastChangeDate: application.residenceInIcelandLastChangeDate,
        // birthCountry: application.birthCountry,
        // isFormerIcelandicCitizen: application.isFormerIcelandicCitizen,
      },
    })

    // submit information about spouse
    await this.spouseApiWithAuth(auth).apiSpousePost({
      spouseNewModel: {
        maritalStatusId: 1, //TODOx should receive string not int (use application.maritalStatusCode)
        dateOfMarriage: application.dateOfMaritalStatus,
        icelandicidIDNO: application.spouse?.nationalId,
        givenName: application.spouse?.givenName,
        surName: application.spouse?.familyName,
        applicantAddress: application.address,
        spouseAddress: application.spouse?.address,
        explanation: application.spouse?.reasonDifferentAddress,
        nationalityId: 1, //TODOx should receive string not int (use application.spouseCitizenshipCode?)
      },
    })

    // submit information about parents with Icelandic citizenship
    const parents = application.parents
    for (let i = 0; i < parents.length; i++) {
      await this.parentApiWithAuth(auth).apiParentPost({
        parentNewModel: {
          icelandicIDNO: parents[i].nationalId,
          givenName: parents[i].givenName,
          surName: parents[i].familyName,
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
      await this.residenceAbroadApiWithAuth(
        auth,
      ).apiResidenceAbroadApplicationIdPost({
        applicationId: applicationId,
        residenceAbroadNewModel: {
          countryId: staysAbroad[i].countryId,
          dateFrom: staysAbroad[i].dateFrom,
          dateTo: staysAbroad[i].dateTo,
          purposeOfStay: staysAbroad[i].purpose,
        },
      })
    }

    // submit information about travel document (passport) for applicant
    await this.travelDocumentApiWithAuth(
      auth,
    ).apiTravelDocumentApplicationIdPost({
      applicationId: applicationId,
      travelDocumentNewModel: {
        dateOfExpiry: application.passport.dateOfExpiry,
        dateOfIssue: application.passport.dateOfIssue,
        issuingCountryId: application.passport.countryOfIssuerId,
        name: application.fullName,
        travelDocumentNo: application.passport.passportNumber,
        travelDocumentTypeId: application.passport.passportTypeId,
      },
    })

    // submit all other supporting documents for applicant
    //TODOx missing endpoint for supporting documents (applicant)
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
    // const selectedChildren = application.selectedChildren
    // for (let i = 0; i < selectedChildren.length; i++) {
    //   const childNationalId = selectedChildren[i]
    //   const child = application.children.find(
    //     (c) => c.nationalId === childNationalId,
    //   )

    //   // create application for child
    //   const childApplicationId = await this.applicationApiWithAuth(
    //     auth,
    //   ).apiApplicationCitizenshipSsnrPost({
    //     ssnr: childNationalId,
    //   })

    //   // submit information about travel document (passport) for child
    //   const childPassport = application.childrenPassport.find(
    //     (c) => c.nationalId === childNationalId,
    //   )
    //   if (childPassport)
    //     await this.travelDocumentApiWithAuth(
    //       auth,
    //     ).apiTravelDocumentApplicationIdPost({
    //       applicationId: childApplicationId,
    //       travelDocumentNewModel: {
    //         dateOfExpiry: childPassport.dateOfExpiry,
    //         dateOfIssue: childPassport.dateOfIssue,
    //         issuingCountryId: childPassport.countryIdOfIssuer,
    //         name: child?.fullName,
    //         travelDocumentNo: childPassport.passportNumber,
    //         travelDocumentTypeId: childPassport.passportTypeId,
    //       },
    //     })

    //   // submit all other supporting documents for child
    //   //TODOx missing endpoint for supporting documents (child)
    //   const childSupportingDocuments = application.childrenSupportingDocuments.find(
    //     (c) => c.nationalId === childNationalId,
    //   )
    //   if (childSupportingDocuments)
    //     await this.supportingDocumentsApiWithAuth(auth).post({
    //       applicationId: childApplicationId,
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

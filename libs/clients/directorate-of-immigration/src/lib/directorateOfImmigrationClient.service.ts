import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  CitizenshipApplication,
  Country,
  CountryOfResidence,
  Passport,
  ResidenceConditionInfo,
  StayAbroad,
  TravelDocumentType,
} from './directorateOfImmigrationClient.types'
import { Injectable } from '@nestjs/common'
import {
  ApplicantApi,
  ApplicantResidenceConditionApi,
  ApplicationApi,
  ApplicationAttachmentApi,
  AttachmentType,
  CountryOfResidenceApi,
  LookupType,
  OptionSetApi,
  ResidenceAbroadApi,
  StaticDataApi,
  StudyApi,
  TravelDocumentApi,
} from '../../gen/fetch'

export
@Injectable()
class DirectorateOfImmigrationClient {
  constructor(
    private applicantApi: ApplicantApi,
    private applicantResidenceConditionApi: ApplicantResidenceConditionApi,
    private applicationApi: ApplicationApi,
    private applicationAttachmentApi: ApplicationAttachmentApi,
    private countryOfResidenceApi: CountryOfResidenceApi,
    private optionSetApi: OptionSetApi,
    private residenceAbroadApi: ResidenceAbroadApi,
    private staticDataApi: StaticDataApi,
    private studyApi: StudyApi,
    private travelDocumentApi: TravelDocumentApi,
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

  private applicationAttachmentApiWithAuth(auth: Auth) {
    return this.applicationAttachmentApi.withMiddleware(
      new AuthMiddleware(auth),
    )
  }

  private countryOfResidenceApiWithAuth(auth: Auth) {
    return this.countryOfResidenceApi.withMiddleware(new AuthMiddleware(auth))
  }

  private residenceAbroadApiWithAuth(auth: Auth) {
    return this.residenceAbroadApi.withMiddleware(new AuthMiddleware(auth))
  }

  private staticDataApiWithAuth(auth: Auth) {
    return this.staticDataApi.withMiddleware(new AuthMiddleware(auth))
  }

  private studyApiWithAuth(auth: Auth) {
    return this.studyApi.withMiddleware(new AuthMiddleware(auth))
  }

  private travelDocumentApiWithAuth(auth: Auth) {
    return this.travelDocumentApi.withMiddleware(new AuthMiddleware(auth))
  }

  // Common:

  async getCountries(): Promise<Country[]> {
    const res = await this.optionSetApi.apiOptionSetLookupTypeGet({
      lookupType: LookupType.Countries,
    })

    return res.map((item) => ({
      id: item.id?.toString() || '',
      name: item.name || '',
    }))
  }

  async getTravelDocumentTypes(): Promise<TravelDocumentType[]> {
    const res = await this.optionSetApi.apiOptionSetLookupTypeGet({
      lookupType: LookupType.TravelDocumentTypes,
    })

    return res.map((item) => ({
      id: item.id || 0,
      name: item.name || '',
    }))
  }

  // Citizenship:

  async getCurrentCountryOfResidenceList(
    auth: Auth,
  ): Promise<CountryOfResidence[]> {
    const res = await this.countryOfResidenceApiWithAuth(
      auth,
    ).apiCountryOfResidenceGetAllGet()

    return res.map((item) => ({
      countryId: item.countryId?.toString() || '',
      countryName: item.countryName || '',
    }))
  }

  async getCurrentStayAbroadList(auth: Auth): Promise<StayAbroad[]> {
    const res = await this.residenceAbroadApiWithAuth(
      auth,
    ).apiResidenceAbroadGetAllGet()

    return res.map((item) => ({
      countryId: item.countryId?.toString() || '',
      countryName: item.countryName || '',
      dateFrom: item.dateFrom,
      dateTo: item.dateTo,
      purposeOfStay: item.purposeOfStay,
    }))
  }

  async getCurrentPassportItem(auth: Auth): Promise<Passport | undefined> {
    const res = await this.travelDocumentApiWithAuth(
      auth,
    ).apiTravelDocumentGetAllGet()

    // Select the most recent entry
    const newestItem = res.sort(
      (a, b) => (b.createdOn?.getTime() || 0) - (a.createdOn?.getTime() || 0),
    )[0]

    return (
      newestItem && {
        dateOfIssue: newestItem.dateOfIssue,
        dateOfExpiry: newestItem.dateOfExpiry,
        name: newestItem.name,
        passportNo: newestItem.travelDocumentNo,
        passportTypeId: newestItem.travelDocumentTypeId,
        passportTypeName: newestItem.travelDocumentTypeName,
        issuingCountryId: newestItem.issuingCountryId?.toString(),
        issuingCountryName: newestItem.issuingCountryName,
      }
    )
  }

  async getCitizenshipResidenceConditionInfo(
    auth: Auth,
  ): Promise<ResidenceConditionInfo> {
    const res = await this.applicantResidenceConditionApiWithAuth(
      auth,
    ).apiApplicantResidenceConditionGetGet()

    return {
      hasValid: res.isAnyResConValid || false,
      hasOnlyTypeMaritalStatus:
        res.isOnlyMarriedOrCohabitationWithISCitizen || false,
    }
  }

  async submitApplicationForCitizenship(
    auth: User,
    application: CitizenshipApplication,
  ): Promise<void> {
    // applicant: create/update applicant
    await this.applicantApiWithAuth(auth).applicantPost({
      applicantNewModel: {
        icelandicIDNO: auth.nationalId,
        givenName: application.givenName,
        surName: application.familyName,
        emailAddress: application.email,
        telephone: application.phone,
        addressCity: application.address,
      },
    })

    // applicant: post static stata
    let staticDataId: string
    staticDataId = await this.staticDataApiWithAuth(auth).apiStaticDataPost({
      staticDataNewModel: {
        ssn: auth.nationalId,
        name: application.givenName + ' ' + application.familyName,
        address: application.address,
        postalCode: application.postalCode,
        municipality: application.city,
        phone: application.phone,
        nationality: application.citizenshipCode,
        dateOfDomicileRegistration: application.residenceInIcelandLastChangeDate
          ? new Date(application.residenceInIcelandLastChangeDate).toISOString()
          : undefined,
        countryOfBirth: application.birthCountry,
        maritalStatus: application.maritalStatusCode,
        dateOfMarriage: application.dateOfMaritalStatus
          ? new Date(application.dateOfMaritalStatus).toISOString()
          : undefined,
        spouseSSN: application.spouse?.nationalId,
        spouseName:
          application.spouse &&
          application.spouse.givenName + ' ' + application.spouse.familyName,
        spouseCountryOfBirth: application.spouse?.birthCountry,
        spouseCitizenship: application.spouse?.citizenshipCode,
        spouseAddress: application.spouse?.address,
        spouseAddressMismatchReason: application.spouse?.reasonDifferentAddress,
        applicantIsChildOfIcelandicCitizen: application.parents.length > 0,
        parent1SSN: application.parents[0]?.nationalId,
        parent1Name:
          application.parents[0] &&
          application.parents[0]?.givenName +
            ' ' +
            application.parents[0]?.familyName,
        parent2SSN: application.parents[1]?.nationalId,
        parent2Name:
          application.parents[1] &&
          application.parents[1]?.givenName +
            ' ' +
            application.parents[1]?.familyName,
        applicantIsFormerIcelandicCitizen: application.isFormerIcelandicCitizen,
      },
    })

    // clean staticDataId and remove double quotes that is added by the openapi generator (bug in )
    staticDataId = staticDataId.replace(/["]/g, '')

    // applicant: create application
    let applicationId: string
    applicationId = await this.applicationApiWithAuth(
      auth,
    ).apiApplicationCitizenshipPost({
      applicationCitizienshipNewModel: {
        staticDataId,
      },
    })

    // clean applicationId and remove double quotes that is added by the openapi generator
    applicationId = applicationId.replace(/["]/g, '')

    // applicant: submit information about countries of residence
    const countriesOfResidence = application.countriesOfResidence
    for (let i = 0; i < countriesOfResidence.length; i++) {
      await this.countryOfResidenceApiWithAuth(auth).apiCountryOfResidencePost({
        countryOfResidenceNewModel: {
          countryId: parseInt(countriesOfResidence[i].countryId),
        },
      })
    }

    // applicant: submit information about stays abroad
    const staysAbroad = application.staysAbroad
    for (let i = 0; i < staysAbroad.length; i++) {
      await this.residenceAbroadApiWithAuth(
        auth,
      ).apiResidenceAbroadApplicationIdPost({
        applicationId,
        residenceAbroadNewModel: {
          countryId: parseInt(staysAbroad[i].countryId),
          dateFrom: staysAbroad[i].dateFrom,
          dateTo: staysAbroad[i].dateTo,
          purposeOfStay: staysAbroad[i].purpose,
        },
      })
    }

    // applicant: submit information about travel document (passport)
    await this.travelDocumentApiWithAuth(
      auth,
    ).apiTravelDocumentApplicationIdPost({
      applicationId,
      travelDocumentNewModel: {
        dateOfExpiry: application.passport.dateOfExpiry,
        dateOfIssue: application.passport.dateOfIssue,
        issuingCountryId: parseInt(application.passport.countryOfIssuerId),
        name: application.fullName,
        travelDocumentNo: application.passport.passportNumber,
        travelDocumentTypeId: application.passport.passportTypeId,
      },
    })

    // applicant: submit travel document and other supporting attachment
    const attachmentList: {
      attachmentType: AttachmentType
      fileList: { filename: string; base64: string; countryId?: string }[]
    }[] = [
      {
        attachmentType: AttachmentType.Passport,
        fileList: application.passport.file || [],
      },
      {
        attachmentType: AttachmentType.BirtCertificate,
        fileList: application.supportingDocuments.birthCertificate || [],
      },
      {
        attachmentType: AttachmentType.ProofOfFinancialCapabilityApplicant,
        fileList: application.supportingDocuments.subsistenceCertificate || [],
      },
      {
        attachmentType: AttachmentType.ProofOfFinancialCapabilityMunicipality,
        fileList:
          application.supportingDocuments.subsistenceCertificateForTown || [],
      },
      {
        attachmentType: AttachmentType.DomicileHistory,
        fileList:
          application.supportingDocuments.certificateOfLegalResidenceHistory ||
          [],
      },
      {
        attachmentType: AttachmentType.ConfirmationIcelandicLanguage,
        fileList:
          application.supportingDocuments.icelandicTestCertificate || [],
      },
      {
        attachmentType: AttachmentType.CriminalRecord,
        fileList: application.supportingDocuments.criminalRecordList || [],
      },
    ]
    for (let j = 0; j < attachmentList.length; j++) {
      const file = attachmentList[j]
      for (let k = 0; k < file.fileList.length; k++) {
        await this.applicationAttachmentApiWithAuth(
          auth,
        ).apiApplicationAttachmentApplicationIdPost({
          applicationId,
          applicationAttachmentNewModel: {
            attachmentType: file.attachmentType,
            fileName: file.fileList[k].filename,
            base64Contents: file.fileList[k].base64,
            countryCode: file.fileList[k].countryId,
          },
        })
      }
    }

    // selected children: create application and submit information
    for (let i = 0; i < application.selectedChildren.length; i++) {
      const selectedChild = application.selectedChildren[i]
      const childNationalId = selectedChild.nationalId
      const childInfo = application.children.find(
        (c) => c.nationalId === childNationalId,
      )

      if (!childInfo) {
        continue
      }

      // child: create applicant
      await this.applicantApiWithAuth(auth).applicantNewChildPost({
        applicantNewChildModel: {
          icelandicIDNO: childInfo.nationalId,
          givenName: childInfo.givenName,
          surName: childInfo.familyName,
        },
      })

      // child: post static stata
      const childStaticDataId = await this.staticDataApiWithAuth(
        auth,
      ).apiStaticDataPost({
        staticDataNewModel: {
          ssn: childInfo.nationalId,
          name: childInfo.givenName + ' ' + childInfo.familyName,
          parent2SSN: selectedChild.otherParentNationalId,
          parent2BirthDate: selectedChild.otherParentBirtDate
            ? new Date(selectedChild.otherParentBirtDate).toISOString()
            : undefined,
          parent2Name: selectedChild.otherParentName,
        },
      })

      // child: create application
      const childApplicationId = await this.applicationApiWithAuth(
        auth,
      ).apiApplicationCitizenshipSsnrPost({
        ssnr: childNationalId,
        applicationCitizienshipNewModel: {
          staticDataId: childStaticDataId,
        },
      })

      // child: submit information about travel document (passport)
      const childPassportInfo = application.childrenPassport.find(
        (c) => c.nationalId === childNationalId,
      )
      if (childPassportInfo) {
        await this.travelDocumentApiWithAuth(
          auth,
        ).apiTravelDocumentApplicationIdPost({
          applicationId: childApplicationId,
          travelDocumentNewModel: {
            dateOfExpiry: childPassportInfo.dateOfExpiry,
            dateOfIssue: childPassportInfo.dateOfIssue,
            issuingCountryId: parseInt(childPassportInfo.countryIdOfIssuer),
            name: childInfo?.fullName,
            travelDocumentNo: childPassportInfo.passportNumber,
            travelDocumentTypeId: childPassportInfo.passportTypeId,
          },
        })
      }

      // child: submit travel document and other supporting attachment
      const childSupportingDocuments =
        application.childrenSupportingDocuments.find(
          (c) => c.nationalId === childNationalId,
        )
      const childAttachmentList: {
        attachmentType: AttachmentType
        fileList: { filename: string; base64: string }[]
      }[] = [
        {
          attachmentType: AttachmentType.Passport,
          fileList: childPassportInfo?.file || [],
        },
        {
          attachmentType: AttachmentType.BirtCertificate,
          fileList: childSupportingDocuments?.birthCertificate || [],
        },
        {
          attachmentType: AttachmentType.WrittenConfirmationChild,
          fileList: childSupportingDocuments?.writtenConsentFromChild || [],
        },
        {
          attachmentType: AttachmentType.ConfirmationOtherParent,
          fileList:
            childSupportingDocuments?.writtenConsentFromOtherParent || [],
        },
        {
          attachmentType: AttachmentType.CustodyDocuments,
          fileList: childSupportingDocuments?.custodyDocuments || [],
        },
      ]
      for (let j = 0; j < childAttachmentList.length; j++) {
        const file = childAttachmentList[j]
        for (let k = 0; k < file.fileList.length; k++) {
          await this.applicationAttachmentApiWithAuth(
            auth,
          ).apiApplicationAttachmentApplicationIdPost({
            applicationId: childApplicationId,
            applicationAttachmentNewModel: {
              attachmentType: file.attachmentType,
              fileName: file.fileList[k].filename,
              base64Contents: file.fileList[k].base64,
            },
          })
        }
      }

      // child: send confirmation that all information has been sent
      const isConfirmed = await this.applicationApiWithAuth(
        auth,
      ).apiApplicationConfirmApplicationIdPatch({
        applicationId: childApplicationId,
      })
      if (!isConfirmed) throw new Error('Application not confirmed')
    }

    // applicant: send confirmation that all information has been sent
    const isConfirmed = await this.applicationApiWithAuth(
      auth,
    ).apiApplicationConfirmApplicationIdPatch({
      applicationId: applicationId,
    })
    if (!isConfirmed) throw new Error('Application not confirmed')
  }
}

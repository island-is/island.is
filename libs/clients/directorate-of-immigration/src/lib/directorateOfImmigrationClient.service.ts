import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { CitizenshipApplication } from './directorateOfImmigrationClient.types'
import { Injectable } from '@nestjs/common'
import {
  ApplicantResidenceConditionApi,
  ApplicantResidenceConditionViewModel,
  ApplicationApi,
  ApplicationAttachmentApi,
  AttachmentType,
  CountryOfResidenceApi,
  CountryOfResidenceViewModel,
  LookupType,
  OptionSetApi,
  OptionSetItem,
  ResidenceAbroadApi,
  ResidenceAbroadViewModel,
  TravelDocumentApi,
  TravelDocumentViewModel,
} from '../../gen/fetch'

@Injectable()
export class DirectorateOfImmigrationClient {
  constructor(
    private applicantResidenceConditionApi: ApplicantResidenceConditionApi,
    private applicationApi: ApplicationApi,
    private applicationAttachmentApi: ApplicationAttachmentApi,
    private countryOfResidenceApi: CountryOfResidenceApi,
    private optionSetApi: OptionSetApi,
    private residenceAbroadApi: ResidenceAbroadApi,
    private travelDocumentApi: TravelDocumentApi,
  ) {}

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

  private travelDocumentApiWithAuth(auth: Auth) {
    return this.travelDocumentApi.withMiddleware(new AuthMiddleware(auth))
  }

  // Common:

  async getCountries(): Promise<OptionSetItem[]> {
    const res = await this.optionSetApi.apiOptionSetLookupTypeGet({
      lookupType: LookupType.Countries,
    })

    return res
  }

  async getTravelDocumentTypes(): Promise<OptionSetItem[]> {
    const res = await this.optionSetApi.apiOptionSetLookupTypeGet({
      lookupType: LookupType.TravelDocumentTypes,
    })

    return res
  }

  // Citizenship:

  async getCurrentCountryOfResidenceList(
    auth: Auth,
  ): Promise<CountryOfResidenceViewModel[]> {
    const res = await this.countryOfResidenceApiWithAuth(
      auth,
    ).apiCountryOfResidenceGetAllGet()

    return res
  }

  async getCurrentStayAbroadList(
    auth: Auth,
  ): Promise<ResidenceAbroadViewModel[]> {
    const res = await this.residenceAbroadApiWithAuth(
      auth,
    ).apiResidenceAbroadGetAllGet()

    return res
  }

  async getCurrentPassportItem(
    auth: Auth,
  ): Promise<TravelDocumentViewModel | undefined> {
    const res = await this.travelDocumentApiWithAuth(
      auth,
    ).apiTravelDocumentGetAllGet()

    // Select the most recent entry
    const sortedList = res.sort(
      (a, b) => (b.createdOn?.getTime() || 0) - (a.createdOn?.getTime() || 0),
    )
    const newestItem = sortedList.length > 0 ? sortedList[0] : undefined

    return newestItem
  }

  async getCitizenshipResidenceConditionInfo(
    auth: Auth,
  ): Promise<ApplicantResidenceConditionViewModel> {
    const res = await this.applicantResidenceConditionApiWithAuth(
      auth,
    ).apiApplicantResidenceConditionGetGet()

    return res
  }

  async submitApplicationForCitizenship(
    auth: User,
    application: CitizenshipApplication,
  ): Promise<void> {
    const applicationIdList = []

    // applicant: create application
    let applicationId = await this.applicationApiWithAuth(
      auth,
    ).apiApplicationCitizenshipCompletePost({
      applicationCitizenshipCompleteNewModel: {
        applicant: {
          icelandicIDNO: auth.nationalId,
          givenName: application.givenName,
          surName: application.familyName,
          emailAddress: application.email,
          telephone: application.phone,
          addressCity: application.address,
          countryOfResidence: application.countriesOfResidence.map((x) => ({
            countryId: parseInt(x.countryId),
          })),
        },
        residenceAbroads: application.staysAbroad.map((x) => ({
          countryId: parseInt(x.countryId),
          dateFrom: x.dateFrom,
          dateTo: x.dateTo,
          purposeOfStay: x.purpose,
        })),
        travelDocuments: [
          {
            dateOfExpiry: application.passport.dateOfExpiry,
            dateOfIssue: application.passport.dateOfIssue,
            issuingCountryId: parseInt(application.passport.countryOfIssuerId),
            name: application.fullName,
            travelDocumentNo: application.passport.passportNumber,
            travelDocumentTypeId: application.passport.passportTypeId,
          },
        ],
        staticData: {
          address: application.address,
          postalCode: application.postalCode,
          municipality: application.city,
          nationality: application.citizenshipCode,
          dateOfDomicileRegistration:
            application.residenceInIcelandLastChangeDate
              ? new Date(
                  application.residenceInIcelandLastChangeDate,
                ).toISOString()
              : undefined,
          countryOfBirth: application.birthCountry,
          maritalStatus: application.maritalStatusCode,
          dateOfMarriage: application.dateOfMaritalStatus
            ? new Date(application.dateOfMaritalStatus).toISOString()
            : undefined,
          spouseSSN: application.spouse?.nationalId,
          spouseName: application.spouse && application.spouse.name,
          spouseCountryOfBirth: application.spouse?.birthCountry,
          spouseCitizenship: application.spouse?.citizenshipCode,
          spouseAddress: application.spouse?.address,
          spouseAddressMismatchReason:
            application.spouse?.reasonDifferentAddress,
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
          applicantIsChildOfIcelandicCitizen: application.parents.length > 0,
          applicantIsFormerIcelandicCitizen:
            application.isFormerIcelandicCitizen,
        },
      },
    })

    // applicant: clean applicationId and remove double quotes that is added by the openapi generator (bug in generator)
    applicationId = applicationId.replace(/["]/g, '')

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

      const childPassportInfo = application.childrenPassport.find(
        (c) => c.nationalId === childNationalId,
      )

      // child: create application
      let childApplicationId = await this.applicationApiWithAuth(
        auth,
      ).apiApplicationCitizenshipChildCompletePost({
        applicationCitizenshipChildCompleteNewModel: {
          applicant: {
            icelandicIDNO: childInfo.nationalId,
            givenName: childInfo.givenName,
            surName: childInfo.familyName,
          },
          travelDocuments: childPassportInfo
            ? [
                {
                  dateOfExpiry: childPassportInfo.dateOfExpiry,
                  dateOfIssue: childPassportInfo.dateOfIssue,
                  issuingCountryId: parseInt(
                    childPassportInfo.countryIdOfIssuer,
                  ),
                  name: childInfo?.fullName,
                  travelDocumentNo: childPassportInfo.passportNumber,
                  travelDocumentTypeId: childPassportInfo.passportTypeId,
                },
              ]
            : null,
          staticData: {
            parent2SSN: selectedChild.otherParentNationalId,
            parent2BirthDate: selectedChild.otherParentBirtDate
              ? new Date(selectedChild.otherParentBirtDate).toISOString()
              : undefined,
            parent2Name: selectedChild.otherParentName,
          },
        },
      })

      // child: clean applicationId and remove double quotes that is added by the openapi generator (bug in generator)
      childApplicationId = childApplicationId.replace(/["]/g, '')

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

      applicationIdList.push(childApplicationId)
    }

    // make sure applicant application id is the last item to be confirmed
    applicationIdList.push(applicationId)

    // send confirmation that all information has been sent for applicant and children
    for (let i = 0; i < applicationIdList.length; i++) {
      const isConfirmed = await this.applicationApiWithAuth(
        auth,
      ).apiApplicationConfirmApplicationIdPatch({
        applicationId: applicationIdList[i],
      })
      if (!isConfirmed)
        throw new Error(
          `Application not confirmed for id ${applicationIdList[i]}`,
        )
    }
  }
}

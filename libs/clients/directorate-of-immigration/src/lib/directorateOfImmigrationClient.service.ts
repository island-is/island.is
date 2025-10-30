import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { CitizenshipApplication } from './directorateOfImmigrationClient.types'
import { Injectable } from '@nestjs/common'
import {
  ApplicantApi,
  ApplicantResidenceConditionApi,
  ApplicantResidenceConditionViewModel,
  ApplicationApi,
  ApplicationAttachmentApi,
  AttachmentType,
  CitizenshipValidity,
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
    private applicantApi: ApplicantApi,
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

  private applicantApiWithAuth(auth: Auth) {
    return this.applicantApi.withMiddleware(new AuthMiddleware(auth))
  }

  // Common:

  getCountries(): Promise<OptionSetItem[]> {
    return this.optionSetApi.apiOptionSetLookupTypeGet({
      lookupType: LookupType.Countries,
    })
  }

  getTravelDocumentTypes(): Promise<OptionSetItem[]> {
    return this.optionSetApi.apiOptionSetLookupTypeGet({
      lookupType: LookupType.TravelDocumentTypes,
    })
  }

  // Citizenship:

  getCurrentCountryOfResidenceList(
    auth: Auth,
  ): Promise<CountryOfResidenceViewModel[]> {
    return this.countryOfResidenceApiWithAuth(
      auth,
    ).apiCountryOfResidenceGetAllGet()
  }

  getApplicantValidity(auth: Auth): Promise<CitizenshipValidity> {
    return this.applicantApiWithAuth(
      auth,
    ).apiApplicantGetCitizenshipValidityGet()
  }

  getCurrentStayAbroadList(auth: Auth): Promise<ResidenceAbroadViewModel[]> {
    return this.residenceAbroadApiWithAuth(auth).apiResidenceAbroadGetAllGet()
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

  getCitizenshipResidenceConditionInfo(
    auth: Auth,
  ): Promise<ApplicantResidenceConditionViewModel> {
    return this.applicantResidenceConditionApiWithAuth(
      auth,
    ).apiApplicantResidenceConditionGetGet()
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
            dateFrom: x.dateFrom,
            dateTo: x.dateTo,
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
          maritalStatus: application.maritalStatus,
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
            application.parents[0] && application.parents[0]?.fullName,
          parent2SSN: application.parents[1]?.nationalId,
          parent2Name:
            application.parents[1] && application.parents[1]?.fullName,
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
      fileName: string
      fileLink: string
      countryCode?: string
    }[] = []

    application.passport.file.map((file) => {
      attachmentList.push({
        attachmentType: AttachmentType.Passport,
        fileName: file.filename,
        fileLink: file.fileUrl,
      })
    })

    application.supportingDocuments.birthCertificate?.map((file) => {
      attachmentList.push({
        attachmentType: AttachmentType.BirtCertificate,
        fileName: file.filename,
        fileLink: file.fileUrl,
      })
    })

    application.supportingDocuments.subsistenceCertificate.map((file) => {
      attachmentList.push({
        attachmentType: AttachmentType.ProofOfFinancialCapabilityApplicant,
        fileName: file.filename,
        fileLink: file.fileUrl,
      })
    })

    application.supportingDocuments.subsistenceCertificateForTown.map(
      (file) => {
        attachmentList.push({
          attachmentType: AttachmentType.ProofOfFinancialCapabilityMunicipality,
          fileName: file.filename,
          fileLink: file.fileUrl,
        })
      },
    )

    application.supportingDocuments.certificateOfLegalResidenceHistory.map(
      (file) => {
        attachmentList.push({
          attachmentType: AttachmentType.DomicileHistory,
          fileName: file.filename,
          fileLink: file.fileUrl,
        })
      },
    )

    application.supportingDocuments.icelandicTestCertificate.map((file) => {
      attachmentList.push({
        attachmentType: AttachmentType.ConfirmationIcelandicLanguage,
        fileName: file.filename,
        fileLink: file.fileUrl,
      })
    })

    application.supportingDocuments.criminalRecord.map((file) => {
      attachmentList.push({
        attachmentType: AttachmentType.CriminalRecord,
        fileName: file.filename,
        fileLink: file.fileUrl,
        countryCode: file.countryId,
      })
    })

    await this.applicationAttachmentApiWithAuth(
      auth,
    ).apiApplicationAttachmentFileLinkNewItemsApplicationIdPost({
      applicationId,
      applicationAttachmentArrayFileLinkNewModel: {
        applicationAttachments: attachmentList,
      },
    })

    // selected children: create application and submit information
    for (let i = 0; i < application.selectedChildren.length; i++) {
      const selectedChild = application.selectedChildren[i]
      const childNationalId = selectedChild.nationalId
      const childInfo = application.children.find(
        (c) => c.nationalId === childNationalId,
      )
      const childCitizenship = application.selectedChildren.find(
        (x) => x.nationalId === childNationalId,
      )?.citizenship

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
          parentApplicationId: applicationId,
          applicant: {
            icelandicIDNO: childInfo.nationalId,
            givenName:
              childInfo.givenName ||
              childInfo.fullName.split(' ').slice(0, -1).join(' '),
            surName:
              childInfo.familyName || childInfo.fullName.split(' ').pop(),
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
            nationality: childCitizenship,
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
        fileName: string
        fileLink: string
        countryCode?: string
      }[] = []

      childPassportInfo?.file.map((file) => {
        childAttachmentList.push({
          attachmentType: AttachmentType.Passport,
          fileName: file.filename,
          fileLink: file.fileUrl,
        })
      })

      childSupportingDocuments?.birthCertificate?.map((file) => {
        childAttachmentList.push({
          attachmentType: AttachmentType.BirtCertificate,
          fileName: file.filename,
          fileLink: file.fileUrl,
        })
      })

      childSupportingDocuments?.writtenConsentFromChild?.map((file) => {
        childAttachmentList.push({
          attachmentType: AttachmentType.WrittenConfirmationChild,
          fileName: file.filename,
          fileLink: file.fileUrl,
        })
      })

      childSupportingDocuments?.writtenConsentFromOtherParent?.map((file) => {
        childAttachmentList.push({
          attachmentType: AttachmentType.ConfirmationOtherParent,
          fileName: file.filename,
          fileLink: file.fileUrl,
        })
      })

      childSupportingDocuments?.custodyDocuments?.map((file) => {
        childAttachmentList.push({
          attachmentType: AttachmentType.CustodyDocuments,
          fileName: file.filename,
          fileLink: file.fileUrl,
        })
      })

      await this.applicationAttachmentApiWithAuth(
        auth,
      ).apiApplicationAttachmentFileLinkNewItemsApplicationIdPost({
        applicationId: childApplicationId,
        applicationAttachmentArrayFileLinkNewModel: {
          applicationAttachments: childAttachmentList,
        },
      })

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

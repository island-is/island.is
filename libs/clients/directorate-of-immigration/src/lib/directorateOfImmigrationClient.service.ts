import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  Agent,
  CitizenshipApplication,
  Country,
  CountryOfResidence,
  CriminalRecord,
  CurrentResidencePermit,
  CurrentResidencePermitType,
  Passport,
  ResidenceConditionInfo,
  StayAbroad,
  Study,
  TravelDocumentType,
} from './directorateOfImmigrationClient.types'
import { Inject, Injectable, Logger } from '@nestjs/common'
import {
  ApplicantApi,
  ApplicantResidenceConditionApi,
  ApplicationApi,
  ApplicationAttachmentApi,
  AttachmentType,
  CountryOfResidenceApi,
  CriminalRecordApi,
  LookupType,
  OptionSetApi,
  ParentApi,
  ResidenceAbroadApi,
  StaticDataApi,
  StudyApi,
  TravelDocumentApi,
} from '../../gen/fetch'
import { LOGGER_PROVIDER } from '@island.is/logging'

export
@Injectable()
class DirectorateOfImmigrationClient {
  constructor(
    private applicantApi: ApplicantApi,
    private applicantResidenceConditionApi: ApplicantResidenceConditionApi,
    private applicationApi: ApplicationApi,
    private applicationAttachmentApi: ApplicationAttachmentApi,
    private countryOfResidenceApi: CountryOfResidenceApi,
    private criminalRecordApi: CriminalRecordApi,
    private optionSetApi: OptionSetApi,
    private parentApi: ParentApi,
    private residenceAbroadApi: ResidenceAbroadApi,
    private staticDataApi: StaticDataApi,
    private studyApi: StudyApi,
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

  private applicationAttachmentApiWithAuth(auth: Auth) {
    return this.applicationAttachmentApi.withMiddleware(
      new AuthMiddleware(auth),
    )
  }

  private countryOfResidenceApiWithAuth(auth: Auth) {
    return this.countryOfResidenceApi.withMiddleware(new AuthMiddleware(auth))
  }

  private criminalRecordApiWithAuth(auth: Auth) {
    return this.criminalRecordApi.withMiddleware(new AuthMiddleware(auth))
  }

  private parentApiWithAuth(auth: Auth) {
    return this.parentApi.withMiddleware(new AuthMiddleware(auth))
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
    try {
      const res = await this.optionSetApi.apiOptionSetLookupTypeGet({
        lookupType: LookupType.Countries,
      })

      return res.map((item) => ({
        id: item.id?.toString() || '', //TODOx string not int
        name: item.name!,
      }))
    } catch (error) {
      const errorMsg = 'Error when trying to get countries from UTL'
      this.logger.error(errorMsg, error)
      throw new Error(errorMsg)
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
      const errorMsg = 'Error when trying to get travel document types from UTL'
      this.logger.error(errorMsg, error)
      throw new Error(errorMsg)
    }
  }

  // Citizenship:

  async getOldCountryOfResidenceList(
    auth: Auth,
  ): Promise<CountryOfResidence[]> {
    try {
      const res = await this.countryOfResidenceApiWithAuth(
        auth,
      ).apiCountryOfResidenceGetAllGet()

      return res.map((item) => ({
        countryId: item.countryId?.toString() || '', //TODOx string not int
        countryName: item.countryName!,
      }))
    } catch (error) {
      const errorMsg = 'Error when trying to get country of residence from UTL'
      this.logger.error(errorMsg, error)
      throw new Error(errorMsg)
    }
  }

  async getOldStayAbroadList(auth: Auth): Promise<StayAbroad[]> {
    try {
      const res = await this.residenceAbroadApiWithAuth(
        auth,
      ).apiResidenceAbroadGetAllGet()

      return res.map((item) => ({
        countryId: item.countryId?.toString() || '', //TODOx string not int
        countryName: item.countryName!,
        dateFrom: item.dateFrom,
        dateTo: item.dateTo,
        purposeOfStay: item.purposeOfStay,
      }))
    } catch (error) {
      const errorMsg = 'Error when trying to get residence abroad from UTL'
      this.logger.error(errorMsg, error)
      throw new Error(errorMsg)
    }
  }

  async getOldPassportItem(auth: Auth): Promise<Passport | undefined> {
    try {
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
          issuingCountryId: newestItem.issuingCountryId?.toString(), //TODOx string not int
          issuingCountryName: newestItem.issuingCountryName,
        }
      )
    } catch (error) {
      const errorMsg = 'Error when trying to get users travel document from UTL'
      this.logger.error(errorMsg, error)
      throw new Error(errorMsg)
    }
  }

  async getCitizenshipResidenceConditionInfo(
    auth: Auth,
  ): Promise<ResidenceConditionInfo> {
    try {
      const res = await this.applicantResidenceConditionApiWithAuth(
        auth,
      ).apiApplicantResidenceConditionGetGet()

      return {
        hasValid: res.isAnyResConValid || false,
        hasOnlyTypeMaritalStatus:
          res.isOnlyMarriedOrCohabitationWithISCitizen || false,
      }
    } catch (error) {
      const errorMsg =
        'Error when trying to get citizenship residence conditions from UTL'
      this.logger.error(errorMsg, error)
      throw new Error(errorMsg)
    }
  }

  async submitApplicationForCitizenship(
    auth: User,
    application: CitizenshipApplication,
  ): Promise<void> {
    // applicant: create/update applicant
    try {
      const applicantOld = await this.applicantApiWithAuth(
        auth,
      ).applicantGetGet()
      if (!applicantOld) {
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
      } else {
        await this.applicantApiWithAuth(auth).applicantPatch({
          applicantEditModel: {
            emailAddress: application.email,
            telephone: application.phone,
          },
        })
      }
    } catch (error) {
      const errorMsg =
        'Error when trying to post/patch citizenship applicant to UTL'
      this.logger.error(errorMsg, error)
      throw new Error(errorMsg)
    }

    // applicant: post static stata
    let staticDataId: string
    try {
      staticDataId = await this.staticDataApiWithAuth(auth).apiStaticDataPost({
        staticDataNewModel: {
          ssn: auth.nationalId,
          name: application.givenName + ' ' + application.familyName,
          address: application.address,
          postalCode: application.postalCode,
          municipality: application.city,
          phone: application.phone,
          nationality: application.citizenshipCode,
          dateOfDomicileRegistration:
            application.residenceInIcelandLastChangeDate?.toISOString(),
          countryOfBirth: application.birthCountry,
          maritalStatus: application.maritalStatusCode,
          dateOfMarriage: application.dateOfMaritalStatus?.toISOString(),
          spouseSSN: application.spouse?.nationalId,
          spouseName:
            application.spouse &&
            application.spouse.givenName + ' ' + application.spouse.familyName,
          spouseCountryOfBirth: application.spouse?.birthCountry,
          spouseCitizenship: application.spouse?.citizenshipCode,
          spouseAddress: application.spouse?.address,
          spouseAddressMismatchReason:
            application.spouse?.reasonDifferentAddress,
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
          applicantIsFormerIcelandicCitizen:
            application.isFormerIcelandicCitizen,
        },
      })
    } catch (error) {
      const errorMsg =
        'Error when trying to post citizenship static data to UTL'
      this.logger.error(errorMsg, error)
      throw new Error(errorMsg)
    }

    // applicant: create application
    let applicationId: string
    try {
      applicationId = await this.applicationApiWithAuth(
        auth,
      ).apiApplicationCitizenshipPost({
        applicationCitizienshipNewModel: {
          staticDataId,
        },
      })

      // clean applicationId and remove double quotes that is added by the openapi generator
      applicationId = applicationId.replace('"', '').replace('"', '')
    } catch (error) {
      const errorMsg =
        'Error when trying to post citizenship application to UTL'
      this.logger.error(errorMsg, error)
      throw new Error(errorMsg)
    }

    // applicant: submit information about countries of residence
    const countriesOfResidence = application.countriesOfResidence
    for (let i = 0; i < countriesOfResidence.length; i++) {
      try {
        await this.countryOfResidenceApiWithAuth(
          auth,
        ).apiCountryOfResidencePost({
          countryOfResidenceNewModel: {
            countryId: parseInt(countriesOfResidence[i].countryId), //TODOx string not int
          },
        })
      } catch (error) {
        const errorMsg =
          'Error when trying to post citizenship country of residence to UTL'
        this.logger.error(errorMsg, error)
        throw new Error(errorMsg)
      }
    }

    // applicant: submit information about stays abroad
    const staysAbroad = application.staysAbroad
    for (let i = 0; i < staysAbroad.length; i++) {
      try {
        await this.residenceAbroadApiWithAuth(
          auth,
        ).apiResidenceAbroadApplicationIdPost({
          applicationId,
          residenceAbroadNewModel: {
            countryId: parseInt(staysAbroad[i].countryId), //TODOx string not int
            dateFrom: staysAbroad[i].dateFrom,
            dateTo: staysAbroad[i].dateTo,
            purposeOfStay: staysAbroad[i].purpose,
          },
        })
      } catch (error) {
        const errorMsg =
          'Error when trying to post citizenship residence abroad to UTL'
        this.logger.error(errorMsg, error)
        throw new Error(errorMsg)
      }
    }

    // applicant: submit information about travel document (passport)
    try {
      await this.travelDocumentApiWithAuth(
        auth,
      ).apiTravelDocumentApplicationIdPost({
        applicationId,
        travelDocumentNewModel: {
          dateOfExpiry: application.passport.dateOfExpiry,
          dateOfIssue: application.passport.dateOfIssue,
          issuingCountryId: parseInt(application.passport.countryOfIssuerId), //TODOx string not int
          name: application.fullName,
          travelDocumentNo: application.passport.passportNumber,
          travelDocumentTypeId: application.passport.passportTypeId,
        },
      })
    } catch (error) {
      const errorMsg =
        'Error when trying to post citizenship travel document to UTL'
      this.logger.error(errorMsg, error)
      throw new Error(errorMsg)
    }

    // applicant: submit travel document and other supporting attachment
    const attachmentList: {
      attachmentType: AttachmentType
      fileList: { base64: string; countryId?: string }[]
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
      try {
        for (let k = 0; k < file.fileList.length; k++) {
          await this.applicationAttachmentApiWithAuth(
            auth,
          ).apiApplicationAttachmentPost({
            applicationId,
            applicationAttachmentNewModel: {
              attachmentType: file.attachmentType,
              fileName: file.attachmentType.toString(),
              base64Contents: file.fileList[k].base64,
              countryCode: file.fileList[k].countryId,
            },
          })
        }
      } catch (error) {
        const errorMsg = `Error when trying to post citizenship attachment document (${file.attachmentType.toString()}) to UTL`
        this.logger.error(errorMsg, error)
        throw new Error(errorMsg)
      }
    }

    // selected children: create application and submit information
    const selectedChildren = application.selectedChildren
    for (let i = 0; i < selectedChildren.length; i++) {
      const childNationalId = selectedChildren[i]
      const child = application.children.find(
        (c) => c.nationalId === childNationalId,
      )

      if (!child) {
        continue
      }

      // child: create applicant
      try {
        const applicantOld = await this.applicantApiWithAuth(
          auth,
        ).applicantGetGet()
        if (!applicantOld) {
          await this.applicantApiWithAuth(auth).applicantNewChildPost({
            applicantNewModel: {
              icelandicIDNO: child.nationalId,
              givenName: child.givenName,
              surName: child.familyName,
              //TODOx
              // emailAddress: child.email,
              // telephone: child.phone,
              // addressCity: child.address,
            },
          })
        } else {
          // TODOx
          console.log('patch applicant child')
        }
      } catch (error) {
        const errorMsg =
          'Error when trying to post citizenship child applicant to UTL'
        this.logger.error(errorMsg, error)
        throw new Error(errorMsg)
      }

      // child: post static stata
      let childStaticDataId: string
      try {
        childStaticDataId = await this.staticDataApiWithAuth(
          auth,
        ).apiStaticDataPost({
          staticDataNewModel: {
            ssn: child.nationalId,
            name: child.givenName + ' ' + child.familyName,
          },
        })
      } catch (error) {
        const errorMsg =
          'Error when trying to post citizenship child static data to UTL'
        this.logger.error(errorMsg, error)
        throw new Error(errorMsg)
      }

      // child: create application
      let childApplicationId: string
      try {
        childApplicationId = await this.applicationApiWithAuth(
          auth,
        ).apiApplicationCitizenshipSsnrPost({
          ssnr: childNationalId,
          applicationCitizienshipNewModel: {
            staticDataId: childStaticDataId,
          },
        })
      } catch (error) {
        const errorMsg =
          'Error when trying to post citizenship child application to UTL'
        this.logger.error(errorMsg, error)
        throw new Error(errorMsg)
      }

      // child: submit information about travel document (passport)
      const childPassportInfo = application.childrenPassport.find(
        (c) => c.nationalId === childNationalId,
      )
      if (childPassportInfo) {
        try {
          await this.travelDocumentApiWithAuth(
            auth,
          ).apiTravelDocumentApplicationIdPost({
            applicationId: childApplicationId,
            travelDocumentNewModel: {
              dateOfExpiry: childPassportInfo.dateOfExpiry,
              dateOfIssue: childPassportInfo.dateOfIssue,
              issuingCountryId: parseInt(childPassportInfo.countryIdOfIssuer), //TODOx string not int
              name: child?.fullName,
              travelDocumentNo: childPassportInfo.passportNumber,
              travelDocumentTypeId: childPassportInfo.passportTypeId,
            },
          })
        } catch (error) {
          const errorMsg =
            'Error when trying to post citizenship child passport to UTL'
          this.logger.error(errorMsg, error)
          throw new Error(errorMsg)
        }
      }

      // child: submit travel document and other supporting attachment
      const childSupportingDocuments =
        application.childrenSupportingDocuments.find(
          (c) => c.nationalId === childNationalId,
        )
      const childAttachmentList: {
        attachmentType: AttachmentType
        fileList: { base64: string }[]
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
        try {
          for (let k = 0; k < file.fileList.length; k++) {
            await this.applicationAttachmentApiWithAuth(
              auth,
            ).apiApplicationAttachmentPost({
              applicationId: childApplicationId,
              applicationAttachmentNewModel: {
                attachmentType: file.attachmentType,
                fileName: file.attachmentType.toString(),
                base64Contents: file.fileList[k].base64,
              },
            })
          }
        } catch (error) {
          const errorMsg = `Error when trying to post citizenship child attachment document (${file.attachmentType.toString()}) to UTL`
          this.logger.error(errorMsg, error)
          throw new Error(errorMsg)
        }
      }
    }
  }

  // Residence permit renewal:

  // TODO call endpoint (that does not yet exist) and not hardcode values
  async getApplicantCurrentResidencePermitType(
    auth: Auth,
  ): Promise<CurrentResidencePermitType> {
    try {
      // const res = await this.applicantApiWithAuth(auth).applicantGetGet()

      return {
        isPermitTypeFamily: true,
        isPermitTypeStudy: false,
        isPermitTypeEmployment: false,
        isWorkPermitTypeEmploymentServiceAgreement: false,
        isWorkPermitTypeEmploymentOther: false,
        isWorkPermitTypeSpecial: false,
      }
    } catch (error) {
      const errorMsg =
        'Error when trying to get current residence permit info from UTL'
      this.logger.error(errorMsg, error)
      throw new Error(errorMsg)
    }
  }

  // TODO call endpoint (that does not yet exist) and not hardcode values
  async getApplicantCurrentResidencePermit(
    auth: Auth,
  ): Promise<CurrentResidencePermit> {
    try {
      // const res = await this.applicantApiWithAuth(auth).applicantGetGet()

      return {
        nationalId: auth.nationalId!,
        permitTypeId: 123,
        permitTypeName: 'Tímabundið dvalarleyfi vegna fjölskyldusameiningar',
        permitValidTo: new Date(),
        canApplyRenewal: {
          canApply: true,
          reason: null,
        },
        canApplyPermanent: {
          canApply: false,
        },
      }
    } catch (error) {
      const errorMsg =
        'Error when trying to get current residence permit info from UTL'
      this.logger.error(errorMsg, error)
      throw new Error(errorMsg)
    }
  }

  // TODO call endpoint (that does not yet exist) and not hardcode values
  async getChildrenCurrentResidencePermit(
    auth: Auth,
  ): Promise<CurrentResidencePermit[]> {
    try {
      // const res = await this.applicantApiWithAuth(auth).applicantGetGet()

      return [
        {
          nationalId: '0703111430',
          permitTypeId: 456,
          permitTypeName: 'Tímabundið dvalarleyfi vegna fjölskyldusameiningar',
          permitValidTo: new Date(),
          canApplyRenewal: {
            canApply: true,
            reason: null,
          },
          canApplyPermanent: {
            canApply: false,
          },
        },
        {
          nationalId: '1012061490',
          permitTypeId: 456,
          permitTypeName: 'Tímabundið dvalarleyfi vegna fjölskyldusameiningar',
          permitValidTo: new Date(),
          canApplyRenewal: {
            canApply: false,
            reason: 'Íslenskur ríkisborgari',
          },
          canApplyPermanent: {
            canApply: false,
          },
        },
      ]
    } catch (error) {
      const errorMsg =
        'Error when trying to get current residence permit info from UTL'
      this.logger.error(errorMsg, error)
      throw new Error(errorMsg)
    }
  }

  // TODO need to add possibility to select for children as well
  async getOldCriminalRecordList(auth: Auth): Promise<CriminalRecord[]> {
    try {
      const res = await this.criminalRecordApiWithAuth(
        auth,
      ).apiCriminalRecordGetAllGet()

      return res.map((item) => ({
        countryId: item.countryId?.toString() || '', //TODOx string not int
        countryName: item.countryName!,
        date: item.when ? new Date(item.when) : null,
        offenceDescription: item.offence,
        punishmentDescription: item.punishment,
      }))
    } catch (error) {
      const errorMsg =
        'Error when trying to get old criminal record info from UTL'
      this.logger.error(errorMsg, error)
      throw new Error(errorMsg)
    }
  }

  // TODO need to add possibility to select for children as well
  async getOldStudyItem(auth: Auth): Promise<Study | undefined> {
    try {
      const res = await this.studyApiWithAuth(auth).apiStudyGetAllGet()

      // Select the most recent entry
      const newestItem = res.sort(
        (a, b) => (b.createdOn?.getTime() || 0) - (a.createdOn?.getTime() || 0),
      )[0]

      return (
        newestItem && {
          schoolNationalId: newestItem.icelandicIDNO!,
          schoolName: newestItem.school!,
        }
      )
    } catch (error) {
      const errorMsg = 'Error when trying to get old study info from UTL'
      this.logger.error(errorMsg, error)
      throw new Error(errorMsg)
    }
  }

  // TODO call endpoint (that does not yet exist)
  async getOldAgentItem(auth: Auth): Promise<Agent | undefined> {
    throw new Error('404')
  }

  // TODO call endpoint (that does not yet exist)
  async submitApplicationForResidencePermitRenewal(auth: User): Promise<void> {
    throw new Error('404')
  }

  // Residence permit permanent:

  // TODO call endpoint (that does not yet exist)
  async submitApplicationForResidencePermitPermanent(
    auth: User,
  ): Promise<void> {
    throw new Error('404')
  }
}

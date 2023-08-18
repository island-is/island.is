import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  Agent,
  Country,
  CriminalRecord,
  CurrentResidencePermit,
  CurrentResidencePermitType,
  Passport,
  StayAbroad,
  Study,
  TravelDocumentType,
} from './residencePermitClient.types'
import { Inject, Injectable, Logger } from '@nestjs/common'
import {
  ApplicantApi,
  CriminalRecordApi,
  LookupType,
  OptionSetApi,
  ResidenceAbroadApi,
  StudyApi,
  TravelDocumentApi,
} from '../../gen/fetch'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class ResidencePermitClient {
  constructor(
    private optionSetApi: OptionSetApi,
    private applicantApi: ApplicantApi,
    private residenceAbroadApi: ResidenceAbroadApi,
    private criminalRecordApi: CriminalRecordApi,
    private studyApi: StudyApi,
    private travelDocumentApi: TravelDocumentApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  private applicantApiWithAuth(auth: Auth) {
    return this.applicantApi.withMiddleware(new AuthMiddleware(auth))
  }
  private residenceAbroadApiWithAuth(auth: Auth) {
    return this.residenceAbroadApi.withMiddleware(new AuthMiddleware(auth))
  }
  private criminalRecordApiWithAuth(auth: Auth) {
    return this.criminalRecordApi.withMiddleware(new AuthMiddleware(auth))
  }
  private studyApiWithAuth(auth: Auth) {
    return this.studyApi.withMiddleware(new AuthMiddleware(auth))
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

  async getApplicantCurrentResidencePermit(
    auth: Auth,
  ): Promise<CurrentResidencePermit> {
    try {
      // const res = await this.applicantApiWithAuth(auth).applicantGetGet()

      //TODOx missing fields in endpoint:
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
      this.logger.error(
        'Error when trying to get current residence permit info from UTL',
        error,
      )
      throw new Error(
        'Villa kom upp þegar reynt var að sækja upplýsingar um núverandi dvalarleyfi þitt.',
      )
    }
  }

  async getChildrenCurrentResidencePermit(
    auth: Auth,
  ): Promise<CurrentResidencePermit[]> {
    try {
      // const res = await this.applicantApiWithAuth(auth).applicantGetGet()

      //TODOx missing fields in endpoint:
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
      this.logger.error(
        'Error when trying to get current residence permit info from UTL',
        error,
      )
      throw new Error(
        'Villa kom upp þegar reynt var að sækja upplýsingar um núverandi dvalarleyfi þitt.',
      )
    }
  }

  async getApplicantCurrentResidencePermitType(
    auth: Auth,
  ): Promise<CurrentResidencePermitType> {
    try {
      // const res = await this.applicantApiWithAuth(auth).applicantGetGet()

      //TODOx missing fields in endpoint:
      return {
        isPermitTypeFamily: true,
        isPermitTypeStudy: false,
        isPermitTypeEmployment: false,
        isWorkPermitTypeEmploymentServiceAgreement: false,
        isWorkPermitTypeEmploymentOther: false,
        isWorkPermitTypeSpecial: false,
      }
    } catch (error) {
      this.logger.error(
        'Error when trying to get current residence permit info from UTL',
        error,
      )
      throw new Error(
        'Villa kom upp þegar reynt var að sækja upplýsingar um núverandi dvalarleyfi þitt.',
      )
    }
  }

  // TODOx vantar að sækja fyrir börn líka
  async getOldStayAbroadList(auth: Auth): Promise<StayAbroad[]> {
    try {
      const res = await this.residenceAbroadApiWithAuth(
        auth,
      ).apiResidenceAbroadGetAllApplicationIdGet({ applicationId: '' }) //TODOx þarf applicationId?

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

  // TODOx vantar að sækja fyrir börn líka
  async getOldCriminalRecordList(auth: Auth): Promise<CriminalRecord[]> {
    try {
      const res = await this.criminalRecordApiWithAuth(
        auth,
      ).apiCriminalRecordGetAllGet()

      return res.map((item) => ({
        countryId: item.countryId!,
        countryName: item.countryName!,
        date: item.when ? new Date(item.when) : null,
        offenceDescription: item.offence,
        punishmentDescription: item.punishment,
      }))
    } catch (error) {
      this.logger.error(
        'Error when trying to get old criminal record info from UTL',
        error,
      )
      throw new Error('Villa kom upp þegar reynt var að sækja sakaferill.')
    }
  }

  // TODOx vantar að sækja fyrir börn líka
  async getOldStudyItem(auth: Auth): Promise<Study | undefined> {
    try {
      const res = await this.studyApiWithAuth(auth).apiStudyGetAllGet()

      //TODOx Select the most recent entry
      const newestItem = res[0]
      // Select the most recent entry

      return (
        newestItem && {
          schoolNationalId: newestItem.icelandicIDNO!,
          schoolName: newestItem.school!,
        }
      )
    } catch (error) {
      this.logger.error(
        'Error when trying to get old study info from UTL',
        error,
      )
      throw new Error(
        'Villa kom upp þegar reynt var að sækja tegund vegabréfs.',
      )
    }
  }

  // TODOx vantar að sækja fyrir börn líka
  async getOldPassportItem(auth: Auth): Promise<Passport | undefined> {
    try {
      const res = await this.travelDocumentApiWithAuth(
        auth,
      ).apiTravelDocumentGetAllApplicationIdGet({ applicationId: '' }) //TODOx þarf applicationId?

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
          issuingCountryId: newestItem.issuingCountryId,
          issuingCountryName: newestItem.issuingCountryName,
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

  async getOldAgentItem(auth: Auth): Promise<Agent | undefined> {
    return undefined //TODOx missing endpoint in API
  }

  async submitApplicationForRenewal(auth: User): Promise<void> {
    // TODOx connect to POST endpoint
  }

  async submitApplicationForPermanent(auth: User): Promise<void> {
    // TODOx connect to POST endpoint
  }
}

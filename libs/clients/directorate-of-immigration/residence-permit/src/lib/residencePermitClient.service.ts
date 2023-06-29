import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  Agent,
  Country,
  CriminalRecord,
  CurrentResidencePermit,
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

  // TODOx vantar að sækja fyrir börn líka (permitTypeId, permitTypeName, permitValidTo, getCanApplyRenewal, getCanApplyPermanent)
  async getCurrentResidencePermit(auth: Auth): Promise<CurrentResidencePermit> {
    try {
      const res = await this.applicantApiWithAuth(auth).applicantGetGet()

      return {
        permitTypeId: 123, //TODOx missing field in endpoint
        permitTypeName: 'Tímabundið dvalarleyfi vegna fjölskyldusameiningar', //TODOx missing field in endpoint
        permitValidTo: new Date(), //TODOx missing field in endpoint

        isPermitTypeFamily: false, //TODOx missing field in endpoint
        isPermitTypeStudy: false, //TODOx missing field in endpoint
        isPermitTypeEmployment: true, //TODOx missing field in endpoint

        isWorkPermitTypeEmploymentServiceAgreement: true, //TODOx missing field in endpoint
        isWorkPermitTypeEmploymentOther: false, //TODOx missing field in endpoint
        isWorkPermitTypeSpecial: false, //TODOx missing field in endpoint

        canApplyRenewal: {
          canApply: true, //TODOx missing field in endpoint
          reason: null, //TODOx missing field in endpoint
        },
        canApplyPermanent: {
          canApply: false, //TODOx missing field in endpoint
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

  // TODOx vantar að sækja fyrir börn líka
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

      //TODOx veljum bara fyrsta???
      const firstRes = res[0]

      return (
        firstRes && {
          schoolNationalId: firstRes.icelandicIDNO!,
          schoolName: firstRes.school!,
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

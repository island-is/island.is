import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
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
  CountryOfResidenceApi,
  LookupType,
  OptionSetApi,
  ResidenceAbroadApi,
  TravelDocumentApi,
} from '../../gen/fetch'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class CitizenshipClient {
  constructor(
    private optionSetApi: OptionSetApi,
    private countryOfResidenceApi: CountryOfResidenceApi,
    private residenceAbroadApi: ResidenceAbroadApi,
    private travelDocumentApi: TravelDocumentApi,
    private applicantResidenceConditionApi: ApplicantResidenceConditionApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

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

  async submitApplicationForCitizenship(auth: User): Promise<void> {
    // TODOx connect to POST endpoint
  }
}

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  Country,
  CountryOfResidence,
  Passport,
  ResidenceCondition,
  StayAbroad,
  TravelDocumentType,
} from './citizenshipClient.types'
import { Injectable } from '@nestjs/common'
import {
  CountryOfResidenceApi,
  LookupType,
  OptionSetApi,
  OptionSetItem,
  ResidenceAbroadApi,
  TravelDocumentApi,
} from '../../gen/fetch'

@Injectable()
export class CitizenshipClient {
  constructor(
    private optionSetApi: OptionSetApi,
    private countryOfResidenceApi: CountryOfResidenceApi,
    private residenceAbroadApi: ResidenceAbroadApi,
    private travelDocumentApi: TravelDocumentApi,
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

  async getResidenceConditions(auth: User): Promise<ResidenceCondition[]> {
    const res = await this.optionSetApi.apiOptionSetLookupTypeGet({
      lookupType: LookupType.ResidenceConditions,
    })

    // TODOx remove dummy filtering on residence conditions
    let filteredRes: OptionSetItem[] = []

    // Gervimaður Færeyjar
    if (auth.nationalId === '0101302399') {
      filteredRes = res.filter((x) => [20090, 20093].includes(x.id!))
    }

    // Gervimaður Bretland
    if (auth.nationalId === '0101304929') {
      filteredRes = res.filter((x) => [20097, 20092].includes(x.id!))
    }

    // Sandra Ósk Þí Torp
    if (auth.nationalId === '1411851449') {
      filteredRes = res.filter((x) => [20091].includes(x.id!))
    }

    return filteredRes.map((item) => ({
      id: item.id!,
      name: item.name!,
      isTypeMaritalStatus: item.id === 20090 || item.id === 20091,
    }))
  }

  async getCountries(): Promise<Country[]> {
    const res = await this.optionSetApi.apiOptionSetLookupTypeGet({
      lookupType: LookupType.Countries,
    })

    return res.map((item) => ({
      id: item.id!,
      name: item.name!,
    }))
  }

  async getTravelDocumentTypes(): Promise<TravelDocumentType[]> {
    const res = await this.optionSetApi.apiOptionSetLookupTypeGet({
      lookupType: LookupType.TravelDocumentTypes,
    })

    return res.map((item) => ({
      id: item.id!,
      name: item.name!,
    }))
  }

  async getOldCountryOfResidenceList(
    auth: Auth,
  ): Promise<CountryOfResidence[]> {
    const res = await this.countryOfResidenceApiWithAuth(
      auth,
    ).apiCountryOfResidenceGetAllGet()

    return res.map((item) => ({
      countryId: item.countryId!,
      countryName: item.countryName!,
    }))
  }

  async getOldStayAbroadList(auth: Auth): Promise<StayAbroad[]> {
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
  }

  async getOldPassportItem(auth: Auth): Promise<Passport | undefined> {
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
  }

  async applyForCitizenship(auth: User): Promise<void> {
    // TODOx connect to POST endpoint
  }
}

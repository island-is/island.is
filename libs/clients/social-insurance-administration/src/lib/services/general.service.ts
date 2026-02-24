import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  GeneralApi,
  TrWebApiServicesDomainUnionsModelsUnionDto,
} from '../../../gen/fetch/v1'
import { CountryDto, mapCountryDto } from '../dto/country.dto'
import { LanguageDto, mapLanguageDto } from '../dto/language.dto'
import { mapMaritalStatusDto, MaritalStatusDto } from '../dto/maritalStatus.dto'
import { mapResidenceDto, ResidenceDto } from '../dto/residence.dto'
import { Locale } from '@island.is/shared/types'

@Injectable()
export class SocialInsuranceAdministrationGeneralService {
  constructor(private readonly generalApi: GeneralApi) {}

  private generalApiWithAuth = (user: User) =>
    this.generalApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getCurrencies(user: User): Promise<Array<string>> {
    return this.generalApiWithAuth(user).apiProtectedV1GeneralCurrenciesGet()
  }

  async getUnions(
    user: User,
  ): Promise<Array<TrWebApiServicesDomainUnionsModelsUnionDto>> {
    return this.generalApiWithAuth(user).apiProtectedV1GeneralUnionsGet()
  }

  async getCountries(
    user: User,
    locale: Locale,
  ): Promise<Array<CountryDto> | null> {
    const data = await this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralCountriesGet()

    const result = data
      .map((d) => mapCountryDto(d, locale))
      .filter((i): i is CountryDto => Boolean(i))

    return result.length ? result : null
  }

  async getLanguages(
    user: User,
    locale: Locale,
  ): Promise<Array<LanguageDto> | null> {
    const data = await this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralLanguagesGet()

    return (
      data
        .map((d) => mapLanguageDto(d, locale))
        .filter((i): i is LanguageDto => Boolean(i)) ?? null
    )
  }

  async getMaritalStatuses(user: User): Promise<Array<MaritalStatusDto>> {
    const data = await this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralMaritalStatusesGet()

    return data
      .map((d) => mapMaritalStatusDto(d))
      .filter((i): i is MaritalStatusDto => Boolean(i))
  }

  async getResidenceTypes(user: User): Promise<Array<ResidenceDto> | null> {
    const data = await this.generalApiWithAuth(
      user,
    ).apiProtectedV1GeneralHousingTypesGet()

    return (
      data
        .map((d) => mapResidenceDto(d))
        .filter((i): i is ResidenceDto => Boolean(i)) ?? null
    )
  }
}

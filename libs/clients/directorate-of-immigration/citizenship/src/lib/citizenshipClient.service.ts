import { User } from '@island.is/auth-nest-tools'
import {
  Country,
  ResidenceCondition,
  TravelDocumentType,
} from './citizenshipClient.types'
import { Injectable } from '@nestjs/common'
import { LookupType, OptionSetApi, OptionSetItem } from '../../gen/fetch'

@Injectable()
export class CitizenshipClient {
  constructor(private optionSetApi: OptionSetApi) {}

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

  async applyForCitizenship(auth: User): Promise<void> {
    // TODOx connect to POST endpoint
  }
}

import { Injectable } from '@nestjs/common'
import {
  DefaultApi,
  VacanciesGetAcceptEnum,
  VacanciesGetLanguageEnum,
} from '../../gen/fetch'

const PAGE_SIZE = 10 // TODO: perhaps have a param in "getVacancies" that controls this number

@Injectable()
export class IcelandicGovernmentInstitutionVacanciesV2Service {
  constructor(private readonly api: DefaultApi) {}

  async getVacancies(input: {
    page: number
    location?: string
    language?: VacanciesGetLanguageEnum
    query?: string
    institution?: string
    vacancyType?: string
  }) {
    const vacancies = await this.api.vacanciesGet({
      accept: VacanciesGetAcceptEnum.Json,
      fetchSize: PAGE_SIZE,
      fetchOffset: (input.page - 1) * PAGE_SIZE,
      jobtype: input.vacancyType,
      language: input.language, // TODO: check other languages
      location: input.location,
      query: input.query,
      stofnun: input.institution,
    })
    return {
      total: vacancies.attributes.totalRows,
      vacancies: [], // TODO: return vacancies
    }
  }

  async getInstitutions() {
    const institutions = await this.api.stofnanirGet()
    // TODO: perhaps fetch all items (check to see if there are more)
    return institutions.items.map((institution) => ({
      id: institution.lookupCode,
      label: institution.meaning,
    }))
  }

  async getVacancyTypes() {
    const types = await this.api.jobtypesGet()
    // TODO: perhaps fetch all items (check to see if there are more)
    return types.items.map((type) => ({
      id: type.lookupCode,
      label: type.meaning,
    }))
  }

  async getLocations() {
    const locations = await this.api.locationsGet()
    // TODO: perhaps fetch all locatiitemsons (check to see if there are more)
    return locations.items.map((location) => ({
      id: location.lookupCode,
      label: location.meaning,
    }))
  }
}

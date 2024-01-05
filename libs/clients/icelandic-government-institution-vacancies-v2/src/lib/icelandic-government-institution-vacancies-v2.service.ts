import { Injectable } from '@nestjs/common'
import {
  DefaultApi,
  VacanciesGetAcceptEnum,
  VacanciesGetLanguageEnum,
  VacanciesVacancyIdGetAcceptEnum,
  VacanciesVacancyIdGetLanguageEnum,
} from '../../gen/fetch'
import { mapSingleVacancy, mapVacancies } from './utils'

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
    const response = await this.api.vacanciesGet({
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
      total: response.attributes.totalRows,
      vacancies: await mapVacancies(response.starfsauglysingar),
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

  async getVacancyById(
    vacancyId: number,
    language?: VacanciesVacancyIdGetLanguageEnum,
  ) {
    const vacancy = await this.api.vacanciesVacancyIdGet({
      vacancyId,
      accept: VacanciesVacancyIdGetAcceptEnum.Json,
      language,
    })

    if (!vacancy?.starfsauglysingar?.[0]) {
      return null
    }

    return mapSingleVacancy(vacancy.starfsauglysingar[0])
  }
}

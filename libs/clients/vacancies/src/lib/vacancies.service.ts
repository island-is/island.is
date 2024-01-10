import { Injectable } from '@nestjs/common'
import {
  DefaultApi,
  VacanciesGetAcceptEnum,
  VacanciesGetLanguageEnum,
  VacanciesVacancyIdGetAcceptEnum,
  VacanciesVacancyIdGetLanguageEnum,
} from '../../gen/fetch'
import { mapSingleVacancy, mapVacancies } from './utils'

@Injectable()
export class VacanciesClientService {
  constructor(private readonly api: DefaultApi) {}

  async getVacancies(input: {
    page: number
    pageSize: number
    language?: VacanciesGetLanguageEnum
    query?: string
    location?: string[]
    institution?: string[]
    fieldOfWork?: string[]
  }) {
    const response = await this.api.vacanciesGet({
      accept: VacanciesGetAcceptEnum.Json,
      fetchSize: input.pageSize,
      fetchOffset: (input.page - 1) * input.pageSize,
      query: input.query,
      language: input.language,
      jobtype: input.fieldOfWork?.join(','),
      location: input.location?.join(','),
      stofnun: input.institution?.join(','),
    })

    return {
      total: response.attributes.totalRows,
      vacancies: await mapVacancies(response.starfsauglysingar ?? []),
    }
  }

  async getInstitutions() {
    const institutions = await this.api.stofnanirGet()
    // TODO: perhaps fetch all items (check to see if there are more)
    return institutions.items
      .filter((type) => type?.lookupCode && type?.meaning)
      .map((institution) => ({
        value: institution.lookupCode,
        label: institution.meaning,
      }))
  }

  async getVacancyTypes() {
    const types = await this.api.jobtypesGet()
    // TODO: perhaps fetch all items (check to see if there are more)
    return types.items
      .filter((type) => type?.lookupCode && type?.meaning)
      .map((type) => ({
        value: type.lookupCode,
        label: type.meaning,
      }))
  }

  async getLocations() {
    const locations = await this.api.locationsGet()
    // TODO: perhaps fetch all locatiitemsons (check to see if there are more)
    return locations.items
      .filter((type) => type?.lookupCode && type?.meaning)
      .map((location) => ({
        value: location.lookupCode,
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

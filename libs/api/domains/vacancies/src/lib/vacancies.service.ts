import { CmsContentfulService, CmsElasticsearchService } from '@island.is/cms'
import { Injectable } from '@nestjs/common'
import { getElasticsearchIndex } from '@island.is/content-search-index-manager'
import {
  VacanciesClientService,
  VacanciesVacancyIdGetLanguageEnum,
} from '@island.is/clients/vacancies'

import {
  mapSingleVacancyFromCms,
  mapVacancyListItemFromCms,
  sortVacancyList,
} from './utils'
import { VacancyByIdInput } from './dto/vacancy.input'
import { VacanciesInput } from './dto/vacancies.input'
import { VacancyListItem } from './models/vacancy.model'

const DEFAULT_LANGUAGE = 'is'
const DEFAULT_PAGE_SIZE = 8
const CMS_ID_PREFIX = 'c-'
const EXTERNAL_SYSTEM_ID_PREFIX = 'x-'

@Injectable()
export class VacanciesService {
  constructor(
    private readonly externalVacanciesV2Service: VacanciesClientService,
    private readonly cmsElasticService: CmsElasticsearchService,
    private readonly cmsContentfulService: CmsContentfulService,
  ) {}

  async getInstitutions() {
    // TODO: fetch from cms as well
    return this.externalVacanciesV2Service.getInstitutions()
  }

  async getVacancyTypes() {
    return this.externalVacanciesV2Service.getVacancyTypes()
  }

  async getLocations() {
    return this.externalVacanciesV2Service.getLocations()
  }

  async getVacancies(input: VacanciesInput) {
    const vacanciesFromExternalSystem =
      await this.getVacanciesFromExternalSystem(input)
    const vacanciesFromCms = await this.getVacanciesFromCms()

    const allVacancies = vacanciesFromExternalSystem.vacancies.concat(
      vacanciesFromCms.vacancies,
    )
    sortVacancyList(allVacancies)

    return {
      vacancies: allVacancies,
      total: vacanciesFromCms.total + (vacanciesFromExternalSystem.total ?? 0), // TODO: verify that this works
      input,
    }
  }

  async getVacancyById(input: VacancyByIdInput) {
    // The prefix of the id determines what service to call
    if (input.id.startsWith(CMS_ID_PREFIX)) {
      return this.getVacancyByIdFromCms(input.id.slice(CMS_ID_PREFIX.length))
    } else if (input.id.startsWith(EXTERNAL_SYSTEM_ID_PREFIX)) {
      const numericId = Number(input.id.slice(EXTERNAL_SYSTEM_ID_PREFIX.length))
      if (isNaN(numericId)) return null
      return this.getVacancyByIdFromExternalSystem(numericId, input.language)
    }

    // If no prefix is present then we determine what service to call depending on if the id is numeric
    const numericId = Number(input.id)

    if (isNaN(numericId)) {
      return this.getVacancyByIdFromCms(input.id)
    }

    return this.getVacancyByIdFromExternalSystem(numericId)
  }

  private async getVacanciesFromExternalSystem(input: VacanciesInput) {
    const vacancyResponse = await this.externalVacanciesV2Service.getVacancies({
      page: input.page,
      pageSize: DEFAULT_PAGE_SIZE,
      institution: input.institution,
      language: input.language,
      query: input.query,
      vacancyType: input.vacancyType,
      location: input.location,
    })

    for (const vacancy of vacancyResponse.vacancies) {
      vacancy.id = `${EXTERNAL_SYSTEM_ID_PREFIX}${vacancy.id}`
    }

    // Extract institution/organization reference identifiers from the vacancies
    const referenceIdentifierSet = new Set<string>()
    for (const vacancy of vacancyResponse.vacancies) {
      if (vacancy.institutionReferenceIdentifier) {
        referenceIdentifierSet.add(vacancy.institutionReferenceIdentifier)
      } else {
        // In case there is no institutionReferenceIdentifier we don't indicate what institution is behind this vacancy
        vacancy.logoUrl = undefined
        vacancy.institutionName = undefined
      }
    }

    // Fetch organizations from cms that have the given reference identifiers so we can use their title and logo
    const organizationsResponse =
      await this.cmsContentfulService.getOrganizations({
        lang: DEFAULT_LANGUAGE,
        referenceIdentifiers: Array.from(referenceIdentifierSet),
      })

    // Create a mapping for reference identifier -> organization data
    const organizationMap = new Map<
      string,
      { logoUrl: string | undefined; title: string }
    >()

    for (const organization of organizationsResponse?.items ?? []) {
      if (organization?.referenceIdentifier) {
        organizationMap.set(organization.referenceIdentifier, {
          logoUrl: organization.logo?.url,
          title: organization.shortTitle || organization.title,
        })
      }
    }

    // Override the logo and title for vacancy institutions/organizations
    for (const vacancy of vacancyResponse.vacancies) {
      if (
        vacancy.institutionReferenceIdentifier &&
        organizationMap.has(vacancy.institutionReferenceIdentifier)
      ) {
        const organization = organizationMap.get(
          vacancy.institutionReferenceIdentifier,
        )
        if (organization) {
          vacancy.logoUrl = organization.logoUrl
          vacancy.institutionName = organization.title
        }
      } else {
        // In case the institution/organization does not exist in the cms we don't use the logo or the name from the external service
        vacancy.logoUrl = undefined
        vacancy.institutionName = undefined
      }
    }

    return {
      total: vacancyResponse.total,
      vacancies: vacancyResponse.vacancies as VacancyListItem[],
    }
  }

  private async getVacanciesFromCms() {
    const response = await this.cmsElasticService.getVacancies(
      getElasticsearchIndex(DEFAULT_LANGUAGE),
    )
    return {
      ...response,
      vacancies: response.vacancies.map(mapVacancyListItemFromCms),
    }
  }

  private async getVacancyByIdFromCms(id: string) {
    const item = await this.cmsElasticService.getSingleVacancy(
      getElasticsearchIndex(DEFAULT_LANGUAGE),
      id,
    )
    if (!item) {
      return { vacancy: null }
    }
    return {
      vacancy: mapSingleVacancyFromCms(item),
    }
  }

  private async getVacancyByIdFromExternalSystem(
    id: number,
    language?: VacanciesVacancyIdGetLanguageEnum,
  ) {
    const vacancy = await this.externalVacanciesV2Service.getVacancyById(
      id,
      language,
    )
    if (!vacancy) {
      return { vacancy: null }
    }

    // If we have a reference identifier we use that to get the institution/organization title and logo from cms
    if (vacancy?.institutionReferenceIdentifier) {
      const organizationResponse =
        await this.cmsContentfulService.getOrganizations({
          lang: DEFAULT_LANGUAGE,
          referenceIdentifiers: [vacancy.institutionReferenceIdentifier],
        })

      const organization = organizationResponse?.items?.[0]

      if (organization?.logo?.url) {
        vacancy.logoUrl = organization.logo.url
      } else {
        vacancy.logoUrl = undefined
      }
      if (organization?.title) {
        vacancy.institutionName = organization.shortTitle || organization.title
      }
    } else {
      // In case the institution/organization does not exist in the cms we don't use the logo from the external service
      if (vacancy?.logoUrl) vacancy.logoUrl = undefined
    }

    return {
      vacancy,
    }
  }
}

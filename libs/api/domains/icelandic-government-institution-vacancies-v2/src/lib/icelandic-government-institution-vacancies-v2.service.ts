import { CmsContentfulService, CmsElasticsearchService } from '@island.is/cms'
import { LOGGER_PROVIDER, Logger } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { IcelandicGovernmentInstitutionVacanciesV2Input } from './dto/icelandicGovernmentInstitutionVacancies.input'
import {
  IcelandicGovernmentInstitutionVacanciesV2Service,
  VacanciesVacancyIdGetLanguageEnum,
} from '@island.is/clients/icelandic-government-institution-vacancies-v2'
import { mapVacancyListItemFromCms, sortVacancyList } from './utils'
import { getElasticsearchIndex } from '@island.is/content-search-index-manager'

const defaultLang = 'is'

@Injectable()
export class VacancyService {
  constructor(
    private readonly externalVacanciesV2Service: IcelandicGovernmentInstitutionVacanciesV2Service,
    private readonly cmsElasticService: CmsElasticsearchService,
    private readonly cmsContentfulService: CmsContentfulService,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  private async getVacanciesFromExternalSystem(
    input: IcelandicGovernmentInstitutionVacanciesV2Input,
  ) {
    const vacancyResponse = await this.externalVacanciesV2Service.getVacancies({
      page: input.page,
      institution: input.institution,
      language: input.language,
      query: input.query,
      vacancyType: input.vacancyType,
      location: input.location,
    })

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
        lang: defaultLang,
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
    for (const vacancy of mappedVacancies) {
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
      vacancies: mappedVacancies,
    }
  }

  private async getVacanciesFromCms() {
    const vacanciesFromCms = await this.cmsElasticService.getVacancies(
      getElasticsearchIndex(defaultLang),
    )
    return vacanciesFromCms.map(mapVacancyListItemFromCms)
  }

  async getVacancies(input: IcelandicGovernmentInstitutionVacanciesV2Input) {
    const vacanciesFromExternalSystem =
      await this.getVacanciesFromExternalSystem(input)
    const vacanciesFromCms = await this.getVacanciesFromCms()

    const allVacancies =
      vacanciesFromExternalSystem.vacancies.concat(vacanciesFromCms)
    sortVacancyList(allVacancies)

    return {
      vacancies: allVacancies,
    }
  }

  private async getVacancyByIdFromCms(id: string) {
    const item = await this.cmsElasticService.getSingleVacancy(
      getElasticsearchIndex(defaultLang),
      id,
    )
    if (!item) {
      return { vacancy: null }
    }
    return {
      vacancy:
        mapIcelandicGovernmentInstitutionVacancyByIdResponseFromCms(item),
    }
  }

  private async getVacancyByIdFromExternalSystem(
    id: number,
    language?: VacanciesVacancyIdGetLanguageEnum,
  ) {
    // TODO: handle id prefix
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
          lang: defaultLang,
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

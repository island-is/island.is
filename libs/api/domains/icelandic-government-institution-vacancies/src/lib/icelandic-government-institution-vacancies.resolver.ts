import { Args, Query, Resolver } from '@nestjs/graphql'
import { Inject } from '@nestjs/common'
import {
  DefaultApi,
  VacanciesGetAcceptEnum,
  VacanciesVacancyIdGetAcceptEnum,
  VacanciesVacancyIdGetLanguageEnum,
} from '@island.is/clients/icelandic-government-institution-vacancies'
import { CacheControl, CacheControlOptions } from '@island.is/nest/graphql'
import { CACHE_CONTROL_MAX_AGE } from '@island.is/shared/constants'
import {
  CmsContentfulService,
  CmsElasticsearchService,
  Vacancy,
} from '@island.is/cms'
import { IcelandicGovernmentInstitutionVacanciesInput } from './dto/icelandicGovernmentInstitutionVacancies.input'
import { IcelandicGovernmentInstitutionVacanciesResponse } from './dto/icelandicGovernmentInstitutionVacanciesResponse'
import { IcelandicGovernmentInstitutionVacancyByIdInput } from './dto/icelandicGovernmentInstitutionVacancyById.input'
import { IcelandicGovernmentInstitutionVacancyByIdResponse } from './dto/icelandicGovernmentInstitutionVacancyByIdResponse'
import {
  CMS_ID_PREFIX,
  DefaultApiVacanciesListItem,
  DefaultApiVacancyDetails,
  EXTERNAL_SYSTEM_ID_PREFIX,
  mapIcelandicGovernmentInstitutionVacanciesFromExternalSystem,
  mapIcelandicGovernmentInstitutionVacancyByIdResponseFromExternalSystem,
  mapIcelandicGovernmentInstitutionVacancyByIdResponseFromCms,
  mapVacancyListItemFromCms,
  sortVacancyList,
} from './utils'
import { getElasticsearchIndex } from '@island.is/content-search-index-manager'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { FetchError } from '@island.is/clients/middlewares'

const defaultCache: CacheControlOptions = { maxAge: CACHE_CONTROL_MAX_AGE }
const defaultLang = 'is'

@Resolver()
export class IcelandicGovernmentInstitutionVacanciesResolver {
  constructor(
    private readonly api: DefaultApi,
    private readonly cmsElasticService: CmsElasticsearchService,
    private readonly cmsContentfulService: CmsContentfulService,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  private async getVacanciesFromExternalSystem(
    input: IcelandicGovernmentInstitutionVacanciesInput,
  ) {
    let errorOccurred = false
    let vacancies: DefaultApiVacanciesListItem[] = []

    try {
      vacancies = (await this.api.vacanciesGet({
        accept: VacanciesGetAcceptEnum.Json,
        language: input.language,
        stofnun: input.institution,
      })) as DefaultApiVacanciesListItem[]
    } catch (error) {
      errorOccurred = true
      if (error instanceof FetchError) {
        this.logger.error(
          'Fetch error occurred when getting vacancies from xroad',
          {
            message: error.message,
            statusCode: error.status,
          },
        )
      } else {
        this.logger.error(
          'Error occurred when getting vacancies from xroad',
          error,
        )
      }
    }

    const mappedVacancies =
      await mapIcelandicGovernmentInstitutionVacanciesFromExternalSystem(
        vacancies,
      )

    // Extract institution/organization reference identifiers from the vacancies
    const referenceIdentifierSet = new Set<string>()
    for (const vacancy of mappedVacancies) {
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
          title: organization.title,
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

    return { vacancies: mappedVacancies, errorOccurred }
  }

  private async getVacanciesFromCms() {
    let errorOccurred = false
    let vacanciesFromCms: Vacancy[] = []

    try {
      vacanciesFromCms = await this.cmsElasticService.getVacancies(
        getElasticsearchIndex(defaultLang),
      )
    } catch (error) {
      errorOccurred = true
      this.logger.error(error)
    }

    return {
      vacancies: vacanciesFromCms.map(mapVacancyListItemFromCms),
      errorOccurred,
    }
  }

  @CacheControl({ maxAge: 600 })
  @Query(() => IcelandicGovernmentInstitutionVacanciesResponse)
  async icelandicGovernmentInstitutionVacancies(
    @Args('input') input: IcelandicGovernmentInstitutionVacanciesInput,
  ): Promise<IcelandicGovernmentInstitutionVacanciesResponse> {
    const {
      vacancies: vacanciesFromExternalSystem,
      errorOccurred: externalSystemErrorOccurred,
    } = await this.getVacanciesFromExternalSystem(input)
    const { vacancies: vacanciesFromCms, errorOccurred: cmsErrorOccurred } =
      await this.getVacanciesFromCms()

    const allVacancies = vacanciesFromExternalSystem.concat(vacanciesFromCms)
    sortVacancyList(allVacancies)

    return {
      vacancies: allVacancies,
      fetchErrorOccurred: externalSystemErrorOccurred || cmsErrorOccurred,
    }
  }

  private async getVacancyFromCms(id: string) {
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

  private async getVacancyFromExternalSystem(
    id: number,
    language?: VacanciesVacancyIdGetLanguageEnum,
  ) {
    const item = (await this.api.vacanciesVacancyIdGet({
      vacancyId: id,
      accept: VacanciesVacancyIdGetAcceptEnum.Json,
      language: language,
    })) as DefaultApiVacancyDetails
    if (!item?.starfsauglysing) {
      return { vacancy: null }
    }

    const vacancy =
      await mapIcelandicGovernmentInstitutionVacancyByIdResponseFromExternalSystem(
        item,
      )

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

  @CacheControl(defaultCache)
  @Query(() => IcelandicGovernmentInstitutionVacancyByIdResponse)
  async icelandicGovernmentInstitutionVacancyById(
    @Args('input') input: IcelandicGovernmentInstitutionVacancyByIdInput,
  ): Promise<IcelandicGovernmentInstitutionVacancyByIdResponse | null> {
    // The prefix of the id determines what service to call
    if (input.id.startsWith(CMS_ID_PREFIX)) {
      return this.getVacancyFromCms(input.id.slice(CMS_ID_PREFIX.length))
    } else if (input.id.startsWith(EXTERNAL_SYSTEM_ID_PREFIX)) {
      const numericId = Number(input.id.slice(EXTERNAL_SYSTEM_ID_PREFIX.length))
      if (isNaN(numericId)) return null
      return this.getVacancyFromExternalSystem(numericId, input.language)
    }

    // If no prefix is present then we determine what service to call depending on if the id is numeric
    const numericId = Number(input.id)

    if (isNaN(numericId)) {
      return this.getVacancyFromCms(input.id)
    }

    return this.getVacancyFromExternalSystem(numericId)
  }
}

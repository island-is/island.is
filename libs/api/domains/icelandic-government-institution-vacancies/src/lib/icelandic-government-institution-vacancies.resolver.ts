import { Args, Query, Resolver } from '@nestjs/graphql'
import { Inject } from '@nestjs/common'
import {
  VacancyApi,
  VacancyResponseDto,
} from '@island.is/clients/financial-management-authority'
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
    private readonly api: VacancyApi,
    private readonly cmsElasticService: CmsElasticsearchService,
    private readonly cmsContentfulService: CmsContentfulService,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  private async getVacanciesFromExternalSystem(
    _input: IcelandicGovernmentInstitutionVacanciesInput,
  ) {
    let errorOccurred = false
    const vacancies: VacancyResponseDto[] = []

    try {
      const pageSize = 100
      let rowOffset = 0

      // The external API is paginated and only returns 25 results by default
      // when no pagination parameters are supplied. We need to keep fetching
      // until no more data is returned.
      // Note: We are currently not applying any additional filters from input.
      // If filtering is added in the future, it should be included in the
      // request parameters inside this loop.
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const page = (await this.api.v1VacancyGetVacancyListGet({
          rowOffset,
          fetchSize: pageSize,
        })) as VacancyResponseDto[]

        if (!page || page.length === 0) {
          break
        }

        vacancies.push(...page)

        if (page.length < pageSize) {
          // Fewer results than requested means we've reached the end.
          break
        }

        rowOffset += page.length
      }
    } catch (error) {
      errorOccurred = true
      if (error instanceof FetchError) {
        this.logger.error(
          'Fetch error occurred when getting vacancies from the Financial Management Authority',
          {
            message: error.message,
            statusCode: error.status,
          },
        )
      } else {
        this.logger.error(
          'Error occurred when getting vacancies from the Financial Management Authority',
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

  private async getVacancyFromExternalSystem(id: string) {
    const item = (await this.api.v1VacancyGetVacancyGet({
      vacancyId: id,
    })) as VacancyResponseDto
    if (!item) {
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
      const id = input.id.slice(EXTERNAL_SYSTEM_ID_PREFIX.length)
      if (id === '') return null
      return this.getVacancyFromExternalSystem(id)
    }

    // If no prefix is present then we first try the CMS and then the external service.
    const vacancyFromCms = await this.getVacancyFromCms(input.id)
    if (vacancyFromCms.vacancy === null) {
      return this.getVacancyFromExternalSystem(input.id)
    }
    return vacancyFromCms
  }
}

import { Args, Query, Resolver } from '@nestjs/graphql'
import {
  DefaultApi,
  VacanciesGetAcceptEnum,
  VacanciesVacancyIdGetAcceptEnum,
  VacanciesVacancyIdGetLanguageEnum,
} from '@island.is/clients/icelandic-government-institution-vacancies'
import { CacheControl, CacheControlOptions } from '@island.is/nest/graphql'
import { CACHE_CONTROL_MAX_AGE } from '@island.is/shared/constants'
import { CmsElasticsearchService } from '@island.is/cms'
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

const defaultCache: CacheControlOptions = { maxAge: CACHE_CONTROL_MAX_AGE }

@Resolver()
export class IcelandicGovernmentInstitutionVacanciesResolver {
  constructor(
    private readonly api: DefaultApi,
    private readonly cmsElasticService: CmsElasticsearchService,
  ) {}

  @CacheControl(defaultCache)
  @Query(() => IcelandicGovernmentInstitutionVacanciesResponse)
  async icelandicGovernmentInstitutionVacancies(
    @Args('input') input: IcelandicGovernmentInstitutionVacanciesInput,
  ): Promise<IcelandicGovernmentInstitutionVacanciesResponse> {
    const vacanciesFromExternalSystem = (await this.api.vacanciesGet({
      accept: VacanciesGetAcceptEnum.Json,
      language: input.language,
      stofnun: input.institution,
    })) as DefaultApiVacanciesListItem[]

    const mappedVacanciesFromExternalSystem = await mapIcelandicGovernmentInstitutionVacanciesFromExternalSystem(
      vacanciesFromExternalSystem,
    )

    const vacanciesFromCms = await this.cmsElasticService.getVacancies(
      getElasticsearchIndex('is'),
    )

    const vacancies = mappedVacanciesFromExternalSystem.concat(
      vacanciesFromCms.map(mapVacancyListItemFromCms),
    )

    sortVacancyList(vacancies)

    return {
      vacancies,
    }
  }

  private async getVacancyFromCms(id: string) {
    const item = await this.cmsElasticService.getSingleVacancy(
      getElasticsearchIndex('is'),
      id,
    )
    if (!item) {
      return { vacancy: null }
    }
    return {
      vacancy: mapIcelandicGovernmentInstitutionVacancyByIdResponseFromCms(
        item,
      ),
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
    return {
      vacancy: await mapIcelandicGovernmentInstitutionVacancyByIdResponseFromExternalSystem(
        item,
      ),
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

import { Args, Query, Resolver } from '@nestjs/graphql'
import {
  DefaultApi,
  VacanciesGetAcceptEnum,
  VacanciesVacancyIdGetAcceptEnum,
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
  mapIcelandicGovernmentInstitutionVacancyByIdResponse,
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

  @CacheControl(defaultCache)
  @Query(() => IcelandicGovernmentInstitutionVacancyByIdResponse)
  async icelandicGovernmentInstitutionVacancyById(
    @Args('input') input: IcelandicGovernmentInstitutionVacancyByIdInput,
  ): Promise<IcelandicGovernmentInstitutionVacancyByIdResponse | null> {
    if (input.id.startsWith(CMS_ID_PREFIX)) {
      const item = await this.cmsElasticService.getSingleVacancy(
        getElasticsearchIndex('is'),
        input.id.slice(CMS_ID_PREFIX.length),
      )
      if (!item) {
        return null
      }
      return {
        vacancy: mapIcelandicGovernmentInstitutionVacancyByIdResponseFromCms(
          item,
        ),
      }
    }

    const numericId = Number(
      input.id.startsWith(EXTERNAL_SYSTEM_ID_PREFIX)
        ? input.id.slice(EXTERNAL_SYSTEM_ID_PREFIX.length)
        : input.id,
    )

    const item = (await this.api.vacanciesVacancyIdGet({
      vacancyId: numericId,
      accept: VacanciesVacancyIdGetAcceptEnum.Json,
      language: input.language,
    })) as DefaultApiVacancyDetails

    if (!item?.starfsauglysing) {
      return null
    }
    return {
      vacancy: await mapIcelandicGovernmentInstitutionVacancyByIdResponse(item),
    }
  }
}

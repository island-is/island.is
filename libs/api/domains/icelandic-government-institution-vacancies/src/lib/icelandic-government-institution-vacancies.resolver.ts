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
  DefaultApiVacanciesListItem,
  DefaultApiVacancyDetails,
  mapIcelandicGovernmentInstitutionVacanciesResponse,
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

    const mappedVacanciesFromExternalSystem = await mapIcelandicGovernmentInstitutionVacanciesResponse(
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
    // If the id is not a number then we search for the vacancy in the cms
    if (isNaN(Number(input.id))) {
      const item = await this.cmsElasticService.getSingleVacancy(
        getElasticsearchIndex('is'),
        input.id,
      )
      if (!item) return null

      return {
        vacancy: mapIcelandicGovernmentInstitutionVacancyByIdResponseFromCms(
          item,
        ),
      }
    }

    // Otherwise if the id is numeric then we look for the vacancy via an endpoint
    const item = (await this.api.vacanciesVacancyIdGet({
      vacancyId: Number(input.id),
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

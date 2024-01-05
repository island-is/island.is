import { Args, Query, Resolver } from '@nestjs/graphql'
import { Inject } from '@nestjs/common'
import {
  IcelandicGovernmentInstitutionVacanciesV2Service,
  VacanciesVacancyIdGetAcceptEnum,
  VacanciesVacancyIdGetLanguageEnum,
} from '@island.is/clients/icelandic-government-institution-vacancies-v2'
import { CacheControl, CacheControlOptions } from '@island.is/nest/graphql'
import { CACHE_CONTROL_MAX_AGE } from '@island.is/shared/constants'
import { CmsContentfulService, CmsElasticsearchService } from '@island.is/cms'
import { IcelandicGovernmentInstitutionVacanciesV2Input } from './dto/icelandicGovernmentInstitutionVacancies.input'
import { IcelandicGovernmentInstitutionVacanciesV2Response } from './dto/icelandicGovernmentInstitutionVacanciesV2Response'
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
import { VacancyService } from './icelandic-government-institution-vacancies-v2.service'

const defaultCache: CacheControlOptions = { maxAge: CACHE_CONTROL_MAX_AGE }

@Resolver()
export class VacancyResolver {
  constructor(
    private readonly vacancyService: VacancyService,
    private readonly cmsElasticService: CmsElasticsearchService,
    private readonly cmsContentfulService: CmsContentfulService,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
  ) {}

  @CacheControl({ maxAge: 600 })
  @Query(() => IcelandicGovernmentInstitutionVacanciesV2Response)
  async icelandicGovernmentInstitutionVacancies(
    @Args('input') input: IcelandicGovernmentInstitutionVacanciesV2Input,
  ): Promise<IcelandicGovernmentInstitutionVacanciesV2Response> {
    const vacanciesFromExternalSystem =
      await this.getVacanciesFromExternalSystem(input)
    const vacanciesFromCms = await this.getVacanciesFromCms()

    const allVacancies = vacanciesFromExternalSystem.concat(vacanciesFromCms)
    sortVacancyList(allVacancies)

    return {
      vacancies: allVacancies,
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

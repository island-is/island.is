import { Args, Query, Resolver } from '@nestjs/graphql'
import { CacheControl, CacheControlOptions } from '@island.is/nest/graphql'
import { CACHE_CONTROL_MAX_AGE } from '@island.is/shared/constants'
import { VacanciesService } from './vacancies.service'
import {
  CmsVacanciesResponse,
  ExternalVacanciesResponse,
} from './dto/vacancies.response'
import {
  CmsVacanciesInput,
  ExternalVacanciesInput,
} from './dto/vacancies.input'
import { VacancyByIdInput } from './dto/vacancy.input'
import { VacancyByIdResponse } from './dto/vacancy.response'
import { FilterOptionListResponse } from './dto/filter-option-list.response'

const defaultCache: CacheControlOptions = { maxAge: CACHE_CONTROL_MAX_AGE }

@Resolver()
export class VacanciesResolver {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @CacheControl(defaultCache)
  @Query(() => CmsVacanciesResponse)
  async cmsVacancies(
    @Args('input') input: CmsVacanciesInput,
  ): Promise<CmsVacanciesResponse> {
    const response = await this.vacanciesService.getVacanciesFromCms(input)
    return {
      vacancies: response.vacancies,
    }
  }

  @CacheControl(defaultCache)
  @Query(() => ExternalVacanciesResponse)
  async externalVacancies(
    @Args('input') input: ExternalVacanciesInput,
  ): Promise<ExternalVacanciesResponse> {
    const response = await this.vacanciesService.getVacanciesFromExternalSystem(
      input,
    )
    return {
      vacancies: response.vacancies,
      total: response.total,
      input,
    }
  }

  @CacheControl(defaultCache)
  @Query(() => FilterOptionListResponse)
  async externalVacancyInstitutions(): Promise<FilterOptionListResponse> {
    const response =
      await this.vacanciesService.getVacancyInstitutionsFromExternalSystem()
    return {
      options: response,
    }
  }

  @CacheControl(defaultCache)
  @Query(() => FilterOptionListResponse)
  async externalVacancyLocations(): Promise<FilterOptionListResponse> {
    const response =
      await this.vacanciesService.getVacancyLocationsFromExternalSystem()
    return {
      options: response,
    }
  }

  @CacheControl(defaultCache)
  @Query(() => FilterOptionListResponse)
  async externalVacancyFieldsOfWork(): Promise<FilterOptionListResponse> {
    const response =
      await this.vacanciesService.getVacancyFieldOfWorkFromExternalSystem()
    return {
      options: response,
    }
  }

  @CacheControl(defaultCache)
  @Query(() => VacancyByIdResponse)
  vacancy(
    @Args('input') input: VacancyByIdInput,
  ): Promise<VacancyByIdResponse | null> {
    return this.vacanciesService.getVacancyById(input)
  }
}

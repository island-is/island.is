import { Args, Query, Resolver } from '@nestjs/graphql'
import { CacheControl, CacheControlOptions } from '@island.is/nest/graphql'
import { CACHE_CONTROL_MAX_AGE } from '@island.is/shared/constants'
import { VacanciesService } from './vacancies.service'
import { VacanciesResponse } from './dto/vacancies.response'
import { VacanciesInput } from './dto/vacancies.input'
import { VacancyByIdInput } from './dto/vacancy.input'
import { VacancyByIdResponse } from './dto/vacancy.response'

const defaultCache: CacheControlOptions = { maxAge: CACHE_CONTROL_MAX_AGE }

@Resolver()
export class VacanciesResolver {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @CacheControl(defaultCache)
  @Query(() => VacanciesResponse)
  vacancies(@Args('input') input: VacanciesInput): Promise<VacanciesResponse> {
    return this.vacanciesService.getVacancies(input)
  }

  @CacheControl(defaultCache)
  @Query(() => VacancyByIdResponse)
  vacancyById(
    @Args('input') input: VacancyByIdInput,
  ): Promise<VacancyByIdResponse | null> {
    return this.vacanciesService.getVacancyById(input)
  }
}

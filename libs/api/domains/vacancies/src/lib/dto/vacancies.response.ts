import { Field, ObjectType } from '@nestjs/graphql'
import { VacancyListItem } from '../models/vacancy.model'
import { CacheField } from '@island.is/nest/graphql'
import { ExternalVacanciesInput } from './vacancies.input'

@ObjectType()
export class ExternalVacanciesResponse {
  @CacheField(() => [VacancyListItem])
  vacancies!: VacancyListItem[]

  @Field(() => Number, { nullable: true })
  total?: number

  // So the frontend can match the request with the response
  @CacheField(() => ExternalVacanciesInput)
  input!: ExternalVacanciesInput
}

@ObjectType()
export class CmsVacanciesResponse {
  @CacheField(() => [VacancyListItem])
  vacancies!: VacancyListItem[]
}

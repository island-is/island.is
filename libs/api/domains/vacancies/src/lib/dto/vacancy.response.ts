import { ObjectType } from '@nestjs/graphql'
import { Vacancy } from '../models/vacancy.model'
import { CacheField } from '@island.is/nest/graphql'

@ObjectType()
export class VacancyByIdResponse {
  @CacheField(() => Vacancy, { nullable: true })
  vacancy?: Vacancy | null
}

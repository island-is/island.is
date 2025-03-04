import { Field, ObjectType } from '@nestjs/graphql'
import { IcelandicGovernmentInstitutionVacancyListItem } from '../models/icelandicGovernmentInstitutionVacancy.model'
import { CacheField } from '@island.is/nest/graphql'

@ObjectType()
export class IcelandicGovernmentInstitutionVacanciesResponse {
  @CacheField(() => [IcelandicGovernmentInstitutionVacancyListItem])
  vacancies!: IcelandicGovernmentInstitutionVacancyListItem[]

  @Field(() => Boolean, { nullable: true })
  fetchErrorOccurred?: boolean
}

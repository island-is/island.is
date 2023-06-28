import { Field, ObjectType } from '@nestjs/graphql'
import { IcelandicGovernmentInstitutionVacancyListItem } from '../models/icelandicGovernmentInstitutionVacancy.model'

@ObjectType()
export class IcelandicGovernmentInstitutionVacanciesResponse {
  @Field(() => [IcelandicGovernmentInstitutionVacancyListItem])
  vacancies!: IcelandicGovernmentInstitutionVacancyListItem[]
}

import { ObjectType } from '@nestjs/graphql'
import { IcelandicGovernmentInstitutionVacancyListItem } from '../models/icelandicGovernmentInstitutionVacancy.model'
import { CacheField } from '@island.is/nest/graphql'

@ObjectType()
export class IcelandicGovernmentInstitutionVacanciesV2Response {
  @CacheField(() => [IcelandicGovernmentInstitutionVacancyListItem])
  vacancies!: IcelandicGovernmentInstitutionVacancyListItem[]
}

import { ObjectType } from '@nestjs/graphql'
import { IcelandicGovernmentInstitutionVacancy } from '../models/icelandicGovernmentInstitutionVacancy.model'
import { CacheField } from '@island.is/nest/graphql'

@ObjectType()
export class IcelandicGovernmentInstitutionVacancyByIdResponse {
  @CacheField(() => IcelandicGovernmentInstitutionVacancy, { nullable: true })
  vacancy?: IcelandicGovernmentInstitutionVacancy | null
}

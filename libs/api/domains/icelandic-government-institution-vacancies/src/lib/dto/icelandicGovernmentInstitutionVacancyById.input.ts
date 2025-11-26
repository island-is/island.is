import { Field, InputType } from '@nestjs/graphql'
import { VacancyLanguageEnum } from '../models/enums'

@InputType()
export class IcelandicGovernmentInstitutionVacancyByIdInput {
  @Field()
  id!: string

  @Field(() => VacancyLanguageEnum, { nullable: true })
  language?: VacancyLanguageEnum
}

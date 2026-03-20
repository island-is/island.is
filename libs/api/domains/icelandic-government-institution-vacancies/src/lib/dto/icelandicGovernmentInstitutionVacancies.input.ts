import { Field, InputType } from '@nestjs/graphql'
import { VacancyLanguageEnum } from '../models/enums'

@InputType()
export class IcelandicGovernmentInstitutionVacanciesInput {
  @Field(() => VacancyLanguageEnum, { nullable: true })
  language?: VacancyLanguageEnum

  @Field({ nullable: true })
  institution?: string
}

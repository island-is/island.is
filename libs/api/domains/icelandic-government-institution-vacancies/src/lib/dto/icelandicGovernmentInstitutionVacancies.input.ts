import { VacanciesGetLanguageEnum } from '@island.is/clients/icelandic-government-institution-vacancies'
import { Field, InputType, registerEnumType } from '@nestjs/graphql'

registerEnumType(VacanciesGetLanguageEnum, {
  name: 'VacanciesGetLanguageEnum',
})

@InputType()
export class IcelandicGovernmentInstitutionVacanciesInput {
  @Field(() => VacanciesGetLanguageEnum, { nullable: true })
  language?: VacanciesGetLanguageEnum

  @Field({ nullable: true })
  institution?: string
}

import { VacanciesGetLanguageEnum } from '@island.is/clients/icelandic-government-institution-vacancies-v2'
import { Field, InputType, registerEnumType } from '@nestjs/graphql'

registerEnumType(VacanciesGetLanguageEnum, {
  name: 'VacanciesGetLanguageV2Enum',
})

@InputType()
export class IcelandicGovernmentInstitutionVacanciesV2Input {
  @Field(() => Number)
  page!: number

  @Field(() => String, { nullable: true })
  location?: string

  @Field(() => VacanciesGetLanguageEnum, { nullable: true })
  language?: VacanciesGetLanguageEnum

  @Field(() => String, { nullable: true })
  query?: string

  @Field(() => String, { nullable: true })
  institution?: string

  @Field(() => String, { nullable: true })
  vacancyType?: string
}

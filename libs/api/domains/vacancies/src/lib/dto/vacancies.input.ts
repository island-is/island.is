import { VacanciesGetLanguageEnum } from '@island.is/clients/vacancies'
import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql'

registerEnumType(VacanciesGetLanguageEnum, {
  name: 'VacanciesGetLanguageV2Enum',
})

@InputType()
@ObjectType('VacanciesInputResponse')
export class VacanciesInput {
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

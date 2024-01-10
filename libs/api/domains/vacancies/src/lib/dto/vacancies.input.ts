import { IsString } from 'class-validator'
import { Field, InputType, ObjectType, registerEnumType } from '@nestjs/graphql'
import { VacanciesGetLanguageEnum } from '@island.is/clients/vacancies'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'

registerEnumType(VacanciesGetLanguageEnum, {
  name: 'VacanciesGetLanguageV2Enum',
})

@InputType()
@ObjectType('CmsVacanciesInputResponse')
export class CmsVacanciesInput {
  @Field(() => String)
  @IsString()
  language: ElasticsearchIndexLocale = 'is'
}

@InputType()
@ObjectType('ExternalVacanciesInputResponse')
export class ExternalVacanciesInput {
  @Field(() => Number)
  page!: number

  @Field(() => [String], { nullable: true })
  location?: string[]

  @Field(() => VacanciesGetLanguageEnum, { nullable: true })
  language?: VacanciesGetLanguageEnum

  @Field(() => String, { nullable: true })
  query?: string

  @Field(() => [String], { nullable: true })
  institution?: string[]

  @Field(() => [String], { nullable: true })
  fieldOfWork?: string[]
}

import { ObjectType, Field } from '@nestjs/graphql'
import { LanguageType } from './languageType.model'

@ObjectType('FormSystemFormApplicant')
export class FormApplicant {
  @Field(() => String)
  id!: string

  @Field(() => LanguageType, { nullable: true })
  description?: LanguageType

  @Field(() => String, { nullable: true })
  applicantTypeId?: string

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => [LanguageType], { nullable: true })
  nameSuggestions?: LanguageType[]
}

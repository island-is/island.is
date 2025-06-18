import { Field, ObjectType } from '@nestjs/graphql'
import { LanguageType } from './languageType.model'

@ObjectType('FormSystemApplicant')
export class Applicant {
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

@ObjectType('FormApplicantType')
export class FormApplicantTypeDto {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  applicantTypeId?: string

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType
}

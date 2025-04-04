import { Field, ObjectType } from '@nestjs/graphql'
import { LanguageType } from './languageType.model'

@ObjectType('FormSystemFormApplicantType')
export class FormApplicantType {
  @Field(() => String)
  id!: string

  @Field(() => String)
  applicantTypeId!: string

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType
}

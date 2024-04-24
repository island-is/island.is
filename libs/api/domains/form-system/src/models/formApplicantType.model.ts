import { ObjectType, Field, Int } from '@nestjs/graphql'
import { LanguageType } from './global.model'

@ObjectType('FormSystemFormApplicantType')
export class FormApplicantType {
  @Field(() => Int, { nullable: true })
  formId?: number

  @Field(() => Int, { nullable: true })
  applicantTypeId?: number

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => String)
  type?: string | null
}

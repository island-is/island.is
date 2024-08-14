import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { LanguageType } from './OLDglobal.model'
import { ApplicantTypeNameSuggestion } from './OLDapplicantTypeNameSuggestion'

@ObjectType('FormSystemApplicantType')
export class ApplicantType {
  @Field(() => Int, { nullable: true })
  id?: number

  @Field(() => Int, { nullable: true })
  applicantTypeId?: number

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => LanguageType, { nullable: true })
  description?: LanguageType

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => [ApplicantTypeNameSuggestion], { nullable: 'itemsAndList' })
  nameSuggestions?: ApplicantTypeNameSuggestion[] | null

  @Field(() => ID, { nullable: true })
  guid?: string
}

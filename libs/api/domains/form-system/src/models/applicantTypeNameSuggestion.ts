import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { LanguageType } from './global.model'

@ObjectType('FormSystemApplicantTypeNameSuggestion')
export class ApplicantTypeNameSuggestion {
  @Field(() => LanguageType, { nullable: true })
  nameSuggestion?: LanguageType

  @Field(() => Int, { nullable: true })
  applicantTypeId?: number

  @Field(() => ID, { nullable: true })
  guid?: string
}

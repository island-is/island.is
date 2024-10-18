import { InputType, Field, Int, ID } from '@nestjs/graphql'
import { LanguageTypeInput } from './language.input'

@InputType('FormSystemApplicantTypeNameSuggestionInput')
export class ApplicantTypeNameSuggestionInput {
  @Field(() => LanguageTypeInput, { nullable: true })
  nameSuggestion?: LanguageTypeInput

  @Field(() => Int, { nullable: true })
  applicantTypeId?: number

  @Field(() => ID, { nullable: true })
  guid?: string
}

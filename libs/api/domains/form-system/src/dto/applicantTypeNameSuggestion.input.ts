import { InputType, Field, Int } from '@nestjs/graphql'
import { LanguageTypeInput } from './language.input'

@InputType('FormSystemApplicantTypeNameSuggestionInput')
export class ApplicantTypeNameSuggestionInput {
  @Field(() => LanguageTypeInput, { nullable: true })
  nameSuggestion?: LanguageTypeInput

  @Field(() => Int, { nullable: true })
  applicantTypeId?: number
}

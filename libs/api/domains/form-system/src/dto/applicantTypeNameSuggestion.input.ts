import { InputType, Field } from "@nestjs/graphql"
import { LanguageTypeInput } from "./language.input"

@InputType('FormSystemApplicantTypeNameSuggestionInput')
export class ApplicantTypeNameSuggestionInput {
  @Field(() => LanguageTypeInput, { nullable: true })
  nameSuggestion?: LanguageTypeInput

  @Field(() => Number, { nullable: true })
  applicantTypeId?: number
}

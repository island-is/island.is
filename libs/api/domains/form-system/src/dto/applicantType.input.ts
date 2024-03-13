import { Field, InputType } from "@nestjs/graphql";
import { LanguageTypeInput } from "./global.input";
import { ApplicantTypeNameSuggestionInput } from "./applicantTypeNameSuggestion.input";


@InputType('FormSystemApplicantTypeInput')
export class ApplicantTypeInput {
  @Field(() => Number, { nullable: true })
  id?: number

  @Field(() => Number, { nullable: true })
  applicantTypeId?: number

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => LanguageTypeInput, { nullable: true })
  description?: LanguageTypeInput

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => ApplicantTypeNameSuggestionInput, { nullable: true })
  nameSuggestion?: ApplicantTypeNameSuggestionInput
}

@InputType('FormSystemFormApplicantTypeInput')
export class FormApplicantTypeInput {
  @Field(() => Number, { nullable: true })
  formId?: number

  @Field(() => Number, { nullable: true })
  applicantTypeId?: number

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => String)
  type?: string | null
}


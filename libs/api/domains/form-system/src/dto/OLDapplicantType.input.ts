import { Field, ID, InputType, Int } from '@nestjs/graphql'
import { LanguageTypeInput } from './OLDlanguage.input'
import { ApplicantTypeNameSuggestionInput } from './OLDapplicantTypeNameSuggestion.input'

@InputType('FormSystemApplicantTypeInput')
export class ApplicantTypeInput {
  @Field(() => Int, { nullable: true })
  id?: number

  @Field(() => Int, { nullable: true })
  applicantTypeId?: number

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => LanguageTypeInput, { nullable: true })
  description?: LanguageTypeInput

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => [ApplicantTypeNameSuggestionInput], { nullable: 'itemsAndList' })
  nameSuggestions?: ApplicantTypeNameSuggestionInput[] | null

  @Field(() => ID, { nullable: true })
  guid?: string
}

@InputType('FormSystemFormApplicantTypeInput')
export class FormApplicantTypeInput {
  @Field(() => Int, { nullable: true })
  formId?: number

  @Field(() => Int, { nullable: true })
  applicantTypeId?: number

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => String, { nullable: true })
  type?: string | null
}

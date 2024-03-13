import { Field, ObjectType } from "@nestjs/graphql";
import { LanguageType } from "./global.model";
import { ApplicantTypeNameSuggestion } from "./applicantTypeNameSuggestion";

@ObjectType('FormSystemApplicantType')
export class ApplicantType {
  @Field(() => Number, { nullable: true })
  id?: number

  @Field(() => Number, { nullable: true })
  applicantTypeId?: number

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => LanguageType, { nullable: true })
  description?: LanguageType

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => ApplicantTypeNameSuggestion, { nullable: true })
  nameSuggestion?: ApplicantTypeNameSuggestion
}

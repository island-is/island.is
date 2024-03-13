import { Field, ObjectType } from "@nestjs/graphql";
import { LanguageType } from "./global.model";


@ObjectType('FormSystemApplicantTypeNameSuggestion')
export class ApplicantTypeNameSuggestion {
  @Field(() => LanguageType, { nullable: true })
  nameSuggestion?: LanguageType

  @Field(() => Number, { nullable: true })
  applicantTypeId?: number
}

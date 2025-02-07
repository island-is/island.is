import { Field, ObjectType } from "@nestjs/graphql";
import { LanguageType } from "./languageType.model";

@ObjectType('FormSystemFormApplicantType')
export class FormApplicantType {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  applicantTypeId?: string

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType
}
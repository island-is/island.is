import { ObjectType, Field } from "@nestjs/graphql";
import { LanguageType } from "./global.model";


@ObjectType('FormSystemFormApplicantType')
export class FormApplicantType {
  @Field(() => Number, { nullable: true })
  formId?: number

  @Field(() => Number, { nullable: true })
  applicantTypeId?: number

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => String)
  type?: string | null
}

import { ObjectType, Field } from "@nestjs/graphql"
import { FormApplicantDtoApplicantTypeEnum } from "@island.is/clients/form-system";
import { LanguageType } from "./LanguageType.model"

@ObjectType('FormSystemFormApplicant')
export class FormApplicant {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => FormApplicantDtoApplicantTypeEnum, { nullable: true })
  applicantType?: FormApplicantDtoApplicantTypeEnum

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType
}

import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { LanguageType } from "../models/LanguageType.model";
import { FormApplicantDtoApplicantTypeEnum } from "@island.is/clients/form-system";

registerEnumType(FormApplicantDtoApplicantTypeEnum, {
  name: 'FormSystemFormApplicantDtoApplicantTypeEnum'
})

@InputType('FormSystemFormApplicantInput')
export class FormApplicantInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => FormApplicantDtoApplicantTypeEnum, { nullable: true })
  applicantType?: FormApplicantDtoApplicantTypeEnum

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

}

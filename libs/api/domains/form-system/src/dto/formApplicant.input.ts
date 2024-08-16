import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { FormApplicantDtoApplicantTypeEnum } from "@island.is/clients/form-system";
import { LanguageTypeInput } from "./languageType.input";

registerEnumType(FormApplicantDtoApplicantTypeEnum, {
  name: 'FormSystemFormApplicantDtoApplicantTypeEnum'
})

@InputType('FormSystemFormApplicantInput')
export class FormApplicantInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => FormApplicantDtoApplicantTypeEnum, { nullable: true })
  applicantType?: FormApplicantDtoApplicantTypeEnum

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

}

import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { LanguageType } from "../models/LanguageType.model";
import { FormCertificationTypeDtoTypeEnum } from "@island.is/clients/form-system";

registerEnumType(FormCertificationTypeDtoTypeEnum, {
  name: 'FormSystemFormCertificationTypeDtoTypeEnum'
})

@InputType('FormSystemFormCertificationTypeInput')
export class FormCertificationTypeInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => LanguageType, { nullable: true })
  description?: LanguageType

  @Field(() => FormCertificationTypeDtoTypeEnum, { nullable: true })
  type?: FormCertificationTypeDtoTypeEnum



}

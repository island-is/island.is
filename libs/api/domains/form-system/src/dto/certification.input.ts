import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { CertificationTypeDtoTypeEnum } from "@island.is/clients/form-system"
import { LanguageTypeInput } from "./languageType.input";

registerEnumType(CertificationTypeDtoTypeEnum, {
  name: 'FormSystemCertificationTypeDtoTypeEnum'
})

@InputType('FormSystemCertificationInput')
export class CertificationInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => LanguageTypeInput, { nullable: true })
  description?: LanguageTypeInput

  @Field(() => CertificationTypeDtoTypeEnum, { nullable: true })
  type?: CertificationTypeDtoTypeEnum
}

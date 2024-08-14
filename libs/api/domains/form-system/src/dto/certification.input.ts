import { Field, InputType, registerEnumType } from "@nestjs/graphql";
import { LanguageType } from "../models/LanguageType.model";
import { CertificationTypeDtoTypeEnum } from "@island.is/clients/form-system"

registerEnumType(CertificationTypeDtoTypeEnum, {
  name: 'FormSystemCertificationTypeDtoTypeEnum'
})

@InputType('FormSystemCertificationInput')
export class CertificationInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => LanguageType, { nullable: true })
  description?: LanguageType

  @Field(() => CertificationTypeDtoTypeEnum, { nullable: true })
  type?: CertificationTypeDtoTypeEnum
}

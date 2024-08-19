import { ObjectType, Field } from "@nestjs/graphql"
import { CertificationTypeDtoTypeEnum } from "@island.is/clients/form-system";
import { LanguageType } from "./LanguageType.model"

@ObjectType('FormSystemFormCertificationType')
export class FormCertificationType {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => LanguageType, { nullable: true })
  description?: LanguageType

  @Field(() => CertificationTypeDtoTypeEnum, { nullable: true })
  type?: CertificationTypeDtoTypeEnum
}

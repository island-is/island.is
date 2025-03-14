import { ObjectType, Field } from '@nestjs/graphql'
import { LanguageType } from './languageType.model'

@ObjectType('FormSystemFormCertificationType')
export class FormCertificationType {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => LanguageType, { nullable: true })
  description?: LanguageType

  @Field(() => Boolean, { nullable: true })
  isCommon?: boolean

  @Field(() => String, { nullable: true })
  certificationTypeId?: string

  @Field(() => String, { nullable: true })
  organizationCertificationId?: string
}

@ObjectType('FormSystemFormCertificationTypeDto')
export class FormCertificationTypeDto {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  certificationTypeId?: string
}

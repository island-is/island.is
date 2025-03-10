import { Field, InputType } from '@nestjs/graphql'
import { LanguageTypeInput } from './languageType.input'

@InputType('FormSystemCertificationInput')
export class CertificationInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => LanguageTypeInput, { nullable: true })
  description?: LanguageTypeInput

  @Field(() => Boolean, { nullable: true })
  isCommon?: boolean

  @Field(() => String, { nullable: true })
  certificationTypeId?: string

  @Field(() => String, { nullable: true })
  organizationCertificationId?: string
}

@InputType('FormSystemFormCertificationTypeDtoInput')
export class FormCertificationTypeDtoInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  certificationTypeId?: string
}

@InputType('FormSystemCreateCertificationDtoInput')
export class CreateCertificationDtoInput {
  @Field(() => String, { nullable: true })
  formId?: string

  @Field(() => String, { nullable: true })
  certificationTypeId?: string
}

@InputType('FormSystemCreateCertificationInput')
export class CreateCertificationInput {
  @Field(() => CreateCertificationDtoInput, { nullable: true })
  createFormCertificationTypeDto?: CreateCertificationDtoInput
}

@InputType('FormSystemDeleteCertificationInput')
export class DeleteCertificationInput {
  @Field(() => String, { nullable: true })
  id?: string
}

@InputType('FormSystemCreateFormCertificationTypeInput')
export class FormCertificationTypeCreateInput {
  @Field(() => FormCertificationTypeDtoInput, { nullable: true })
  createFormCertificationTypeDto?: FormCertificationTypeDtoInput
}

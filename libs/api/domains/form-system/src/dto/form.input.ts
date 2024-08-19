import { Field, InputType, Int, registerEnumType } from "@nestjs/graphql";
import { SectionInput } from "./section.input";
import { ScreenInput } from "./screen.input";
import { FieldInput } from "./field.input";
import { LanguageTypeInput } from "./languageType.input";
import { CertificationTypeDtoTypeEnum, FormApplicantDtoApplicantTypeEnum } from "@island.is/clients/form-system"
import { FieldTypeInput } from "./fieldType.input";
import { ListTypeInput } from "./listType.input";

registerEnumType(FormApplicantDtoApplicantTypeEnum, {
  name: 'FormSystemFormApplicantDtoApplicantTypeEnum'
})

registerEnumType(CertificationTypeDtoTypeEnum, {
  name: 'FormSystemCertificationTypeDtoTypeEnum'
})

@InputType('FormSystemCreateFormInput')
export class CreateFormInput {
  @Field(() => String, { nullable: true })
  organizationId?: string
}

@InputType('FormSystemDeleteFormInput')
export class DeleteFormInput {
  @Field(() => String, { nullable: true })
  id?: string
}

@InputType('FormSystemGetFormInput')
export class GetFormInput {
  @Field(() => String, { nullable: true })
  id?: string
}

@InputType('FormSystemGetAllFormsInput')
export class GetAllFormsInput {
  @Field(() => String, { nullable: true })
  organizationId?: string
}

@InputType('FormSystemFormApplicantInput')
export class FormApplicantInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => FormApplicantDtoApplicantTypeEnum, { nullable: true })
  applicantType?: FormApplicantDtoApplicantTypeEnum

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput
}

@InputType('FormSystemFormCertificationTypeInput')
export class FormCertificationTypeInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => LanguageTypeInput, { nullable: true })
  description?: LanguageTypeInput

  @Field(() => CertificationTypeDtoTypeEnum, { nullable: true })
  type?: CertificationTypeDtoTypeEnum
}

@InputType('FormSystemFormResponseInput')
export class FormResponseInput {
  @Field(() => FormInput, { nullable: true })
  form?: FormInput

  @Field(() => [FieldTypeInput], { nullable: 'itemsAndList' })
  fieldTypes?: FieldTypeInput[]

  @Field(() => [FormCertificationTypeInput], { nullable: 'itemsAndList' })
  certificationTypes?: FormCertificationTypeInput[]

  @Field(() => [ListTypeInput], { nullable: 'itemsAndList' })
  listTypes?: ListTypeInput[]

  @Field(() => [FormInput], { nullable: 'itemsAndList' })
  forms?: FormInput[]
}

@InputType('FormSystemFormInput')
export class FormInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  organizationId?: string

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => String, { nullable: true })
  slug?: string

  @Field(() => Date, { nullable: true })
  invalidationDate?: Date

  @Field(() => Date, { nullable: true })
  created?: Date

  @Field(() => Date, { nullable: true })
  modified?: Date

  @Field(() => Boolean, { nullable: true })
  isTranslated?: boolean

  @Field(() => Int, { nullable: true })
  applicationDaysToRemove?: number

  @Field(() => Int, { nullable: true })
  derivedFrom?: number

  @Field(() => Boolean, { nullable: true })
  stopProgressOnValidatingScreen?: boolean

  @Field(() => LanguageTypeInput, { nullable: true })
  completedMessage?: LanguageTypeInput

  @Field(() => [FormCertificationTypeInput], { nullable: 'itemsAndList' })
  certificationTypes?: FormCertificationTypeInput[]

  @Field(() => [FormApplicantInput], { nullable: 'itemsAndList' })
  applicants?: FormApplicantInput[]

  @Field(() => [SectionInput], { nullable: 'itemsAndList' })
  sections?: SectionInput[]

  @Field(() => [ScreenInput], { nullable: 'itemsAndList' })
  screens?: ScreenInput[]

  @Field(() => [FieldInput], { nullable: 'itemsAndList' })
  fields?: FieldInput[]
}

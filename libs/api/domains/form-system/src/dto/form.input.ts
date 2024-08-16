import { Field, InputType, Int } from "@nestjs/graphql";
import { FormCertificationTypeInput } from "./formCertificationType.input";
import { FormApplicantInput } from "./formApplicant.input";
import { SectionInput } from "./section.input";
import { ScreenInput } from "./screen.input";
import { FieldInput } from "./field.input";
import { LanguageTypeInput } from "./languageType.input";

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

  @Field(() => [FormCertificationTypeInput], { nullable: true })
  certificationTypes?: FormCertificationTypeInput[]

  @Field(() => [FormApplicantInput], { nullable: true })
  applicants?: FormApplicantInput[]

  @Field(() => [SectionInput], { nullable: true })
  sections?: SectionInput[]

  @Field(() => [ScreenInput], { nullable: true })
  screens?: ScreenInput[]

  @Field(() => [FieldInput], { nullable: true })
  fields?: FieldInput[]
}

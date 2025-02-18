import { Field, InputType } from '@nestjs/graphql'
import { LanguageTypeInput } from './languageType.input'
import { DependencyInput } from './form.input'

@InputType('FormSystemCreateApplicantDtoInput')
export class FormSystemCreateApplicantDtoInput {
  @Field(() => String, { nullable: true })
  formId?: string

  @Field(() => String, { nullable: true })
  applicantTypeId?: string
}

@InputType('FormSystemUpdateApplicantDtoInput')
export class FormSystemUpdateApplicantDtoInput {
  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput
}

@InputType('FormSystemCreateApplicantInput')
export class CreateApplicantInput {
  @Field(() => FormSystemCreateApplicantDtoInput, { nullable: true })
  createFormApplicantTypeDto?: FormSystemCreateApplicantDtoInput
}

@InputType('FormSystemDeleteApplicantInput')
export class DeleteApplicantInput {
  @Field(() => String, { nullable: true })
  id?: string
}

@InputType('FormSystemUpdateApplicantInput')
export class UpdateApplicantInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => FormSystemUpdateApplicantDtoInput, { nullable: true })
  updateFormApplicantTypeDto?: FormSystemUpdateApplicantDtoInput
}

@InputType('FormSystemUpdateApplicationDependenciesInput')
export class UpdateApplicationDependenciesInput {
  @Field(() => [DependencyInput], { nullable: 'itemsAndList' })
  dependencies?: DependencyInput[]

  @Field(() => [String], { nullable: 'itemsAndList' })
  completed?: string[]
}

@InputType('FormSystemFormApplicantInput')
export class FormApplicantInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => LanguageTypeInput, { nullable: true })
  description?: LanguageTypeInput

  @Field(() => String, { nullable: true })
  applicantTypeId?: string

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => [LanguageTypeInput], { nullable: true })
  nameSuggestions?: LanguageTypeInput[]
}

@InputType('FormSystemFormApplicantTypeDtoInput')
export class FormApplicantTypeDtoInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  applicantTypeId?: string

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput
}

@InputType('FormSystemFormApplicantTypeUpdateInput')
export class FormApplicantTypeUpdateInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => FormApplicantTypeDtoInput, { nullable: true })
  updateFormApplicantTypeDto?: FormApplicantTypeDtoInput
}

@InputType('FormSystemFormApplicantTypeDeleteInput')
export class FormApplicantTypeDeleteInput {
  @Field(() => String, { nullable: true })
  id?: string
}
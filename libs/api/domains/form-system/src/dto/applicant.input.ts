import { Field, InputType } from '@nestjs/graphql'
import { LanguageTypeInput } from './languageType.input'

@InputType('CreateFormSystemApplicantDtoInput')
export class CreateApplicantDtoInput {
  @Field(() => String)
  formId!: string

  @Field(() => String)
  applicantTypeId!: string
}

@InputType('DeleteFormSystemApplicantDtoInput')
export class DeleteApplicantDtoInput {
  @Field(() => String)
  formId!: string

  @Field(() => String)
  applicantTypeId!: string
}

@InputType('UpdateFormSystemApplicantDtoInput')
export class FormSystemUpdateApplicantDtoInput {
  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput
}

@InputType('CreateFormSystemApplicantInput')
export class CreateApplicantInput {
  @Field(() => CreateApplicantDtoInput, { nullable: true })
  createFormApplicantTypeDto?: CreateApplicantDtoInput
}

@InputType('DeleteFormSystemApplicantInput')
export class DeleteApplicantInput {
  @Field(() => DeleteApplicantDtoInput, { nullable: true })
  deleteFormApplicantTypeDto?: DeleteApplicantDtoInput
}

@InputType('UpdateFormSystemApplicantInput')
export class UpdateApplicantInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => FormSystemUpdateApplicantDtoInput, { nullable: true })
  updateFormApplicantTypeDto?: FormSystemUpdateApplicantDtoInput
}

@InputType('FormSystemFormApplicantInput')
export class FormApplicantInput {
  @Field(() => String)
  id!: string

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

@InputType('UpdateFormSystemFormApplicantTypeInput')
export class FormApplicantTypeUpdateInput {
  @Field(() => String)
  id!: string

  @Field(() => FormApplicantTypeDtoInput, { nullable: true })
  updateFormApplicantTypeDto?: FormApplicantTypeDtoInput
}

@InputType('DeleteFormSystemFormApplicantTypeInput')
export class FormApplicantTypeDeleteInput {
  @Field(() => String)
  id!: string
}

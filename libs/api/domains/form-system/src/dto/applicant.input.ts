import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { CreateFormApplicantDtoApplicantTypeEnum } from '@island.is/clients/form-system'
import { LanguageTypeInput } from './languageType.input'

registerEnumType(CreateFormApplicantDtoApplicantTypeEnum, {
  name: 'FormSystemCreateFormApplicantDtoApplicantTypeEnum',
})

@InputType('FormSystemCreateApplicantDtoInput')
export class FormSystemCreateApplicantDtoInput {
  @Field(() => String, { nullable: true })
  formId?: string

  @Field(() => CreateFormApplicantDtoApplicantTypeEnum, { nullable: true })
  applicantType?: CreateFormApplicantDtoApplicantTypeEnum
}

@InputType('FormSystemUpdateApplicantDtoInput')
export class FormSystemUpdateApplicantDtoInput {
  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput
}

@InputType('FormSystemCreateApplicantInput')
export class CreateApplicantInput {
  @Field(() => FormSystemCreateApplicantDtoInput, { nullable: true })
  createFormApplicantDto?: FormSystemCreateApplicantDtoInput
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
  updateFormApplicantDto?: FormSystemUpdateApplicantDtoInput
}

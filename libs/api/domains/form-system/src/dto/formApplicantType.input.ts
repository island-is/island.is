import { Field, InputType } from '@nestjs/graphql'
import { LanguageTypeInput } from './languageType.input'

@InputType('FormSystemFormApplicantTypeInput')
export class FormApplicantTypeCreateInput {
  @Field(() => String, { nullable: true })
  formId?: string

  @Field(() => String, { nullable: true })
  applicantTypeId?: string
}

@InputType('FormSystemFormApplicantTypeDtoInput')
export class FormApplicantTypeDtoInput {
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

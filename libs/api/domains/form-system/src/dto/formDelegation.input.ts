import { Field, InputType } from '@nestjs/graphql'

@InputType('FormSystemFormDelegationDtoInput')
export class FormDelegationDtoInput {
  @Field(() => String, { nullable: true })
  formId?: string

  @Field(() => String, { nullable: true })
  delegation?: string
}

@InputType('FormSystemUpdateFormDelegationInput')
export class FormDelegationUpdateInput {
  @Field(() => FormDelegationDtoInput, { nullable: true })
  updateFormDelegationDto?: FormDelegationDtoInput
}

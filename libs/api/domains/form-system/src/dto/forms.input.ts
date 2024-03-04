import { Field, InputType, Int } from "@nestjs/graphql";
import { FormUpdateDto } from '@island.is/clients/form-system'
import { Form } from "../models/form.model";


@InputType('FormSystemGetFormInput')
export class GetFormInput {
  @Field(() => Int)
  id!: number
}

@InputType('FormSystemGetFormsInput')
export class GetFormsInput {
  @Field(() => Int)
  organizationId!: number
}

@InputType('FormSystemCreateFormInput')
export class CreateFormInput {
  @Field(() => Int)
  organizationId!: number
}

@InputType('FormSystemDeleteFormInput')
export class DeleteFormInput {
  @Field(() => Int)
  id!: number
}

@InputType('FormSystemUpdateFormInput')
export class UpdateFormInput {
  @Field(() => Int, { nullable: true })
  formId!: number

  @Field(() => Form, { nullable: true })
  form?: Form

}

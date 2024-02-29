import { Field, InputType, Int } from "@nestjs/graphql"
import { InputCreationDto, InputUpdateDto } from "@island.is/clients/form-system"
import { CreateInput, UpdateInput } from "../models/input.model"

@InputType('FormSystemGetGroupInput')
export class GetInputInput {
  @Field(() => Int)
  id!: number
}

@InputType('FormSystemCreateGroupInput')
export class CreateInputInput {
  @Field(() => CreateInput, { nullable: true })
  inputCreationDto?: InputCreationDto
}

@InputType('FormSystemDeleteGroupInput')
export class DeleteInputInput {
  @Field(() => Int)
  inputId!: number
}

@InputType('FormSystemUpdateGroupInput')
export class UpdateInputInput {
  @Field(() => Int, { nullable: true })
  inputId!: number

  @Field(() => UpdateInput, { nullable: true })
  inputUpdateDto?: InputUpdateDto
}

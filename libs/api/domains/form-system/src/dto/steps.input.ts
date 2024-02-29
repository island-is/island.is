import { Field, InputType, Int } from "@nestjs/graphql";
import { CreateStep, UpdateStep } from "../models/step.model";
import { StepCreationDto, StepUpdateDto } from '@island.is/clients/form-system'



@InputType('FormSystemGetStepInput')
export class GetStepInput {
  @Field(() => Int)
  id!: number
}

@InputType('FormSystemCreateStepInput')
export class CreateStepInput {
  @Field(() => CreateStep, { nullable: true })
  stepCreationDto?: StepCreationDto
}

@InputType('FormSystemDeleteStepInput')
export class DeleteStepInput {
  @Field(() => Int)
  stepId!: number
}

@InputType('FormSystemUpdateStepInput')
export class UpdateStepInput {
  @Field(() => Int, { nullable: true })
  stepId!: number

  @Field(() => UpdateStep, { nullable: true })
  stepUpdateDto?: StepUpdateDto
}

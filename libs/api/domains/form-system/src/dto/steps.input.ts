import { Field, InputType, Int } from "@nestjs/graphql";
import { CreateStep, UpdateStep } from "../models/step.model";


@InputType('FormSystemGetStepInput')
export class GetStepInput {
  @Field(() => Int)
  id!: number
}

@InputType('FormSystemCreateStepInput')
export class CreateStepInput {
  @Field(() => CreateStep, { nullable: true })
  stepCreationDto?: CreateStep
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
  stepUpdateDto?: UpdateStep
}

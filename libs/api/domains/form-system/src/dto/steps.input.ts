import { Field, ID, InputType, Int } from '@nestjs/graphql'
import { LanguageTypeInput } from './language.input'
import { GroupInput } from './groups.input'

@InputType('FormSystemStepCreation')
export class StepCreation {
  @Field(() => Int, { nullable: true })
  formId?: number

  @Field(() => Int, { nullable: true })
  displayOrder?: number
}

@InputType('FormSystemStepUpdate')
export class StepUpdate {
  @Field(() => Int, { nullable: true })
  id?: number

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => Number, { nullable: true })
  displayOrder?: number

  @Field(() => LanguageTypeInput, { nullable: true })
  waitingText?: LanguageTypeInput

  @Field(() => Boolean, { nullable: true })
  callRuleset?: boolean
}

@InputType('FormSystemGetStepInput')
export class GetStepInput {
  @Field(() => Int)
  id!: number
}

@InputType('FormSystemCreateStepInput')
export class CreateStepInput {
  @Field(() => StepCreation, { nullable: true })
  stepCreationDto?: StepCreation
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

  @Field(() => StepUpdate, { nullable: true })
  stepUpdateDto?: StepUpdate
}

@InputType('FormSystemStepInput')
export class StepInput {
  @Field(() => Int, { nullable: true })
  id?: number

  @Field(() => ID, { nullable: true })
  guid?: string

  @Field(() => Number, { nullable: true })
  displayOrder?: number

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => LanguageTypeInput, { nullable: true })
  waitingText?: LanguageTypeInput

  @Field(() => Boolean, { nullable: true })
  callRuleset?: boolean

  @Field(() => Boolean, { nullable: true })
  isHidden?: boolean

  @Field(() => Boolean, { nullable: true })
  isCompleted?: boolean

  @Field(() => [GroupInput], { nullable: 'itemsAndList' })
  groups?: GroupInput[] | null
}

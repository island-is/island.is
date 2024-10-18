import { Field, ID, InputType, Int } from '@nestjs/graphql'
import { LanguageTypeInput } from './language.input'
import { InputInput } from './inputs.input'

@InputType('FormSystemGroupCreation')
export class CreateGroup {
  @Field(() => Int, { nullable: true })
  stepId?: number

  @Field(() => Number, { nullable: true })
  displayOrder?: number
}

@InputType('FormSystemGroupUpdate')
export class UpdateGroup {
  @Field(() => Int, { nullable: true })
  id?: number

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => ID, { nullable: true })
  guid?: string

  @Field(() => Number, { nullable: true })
  displayOrder?: number

  @Field(() => Number, { nullable: true })
  multiSet?: number

  @Field(() => Int, { nullable: true })
  stepId?: number
}

@InputType('FormSystemGetGroupInput')
export class GetGroupInput {
  @Field(() => Int)
  id!: number
}

@InputType('FormSystemCreateGroupInput')
export class CreateGroupInput {
  @Field(() => CreateGroup, { nullable: true })
  groupCreationDto?: CreateGroup
}

@InputType('FormSystemDeleteGroupInput')
export class DeleteGroupInput {
  @Field(() => Int)
  groupId!: number
}

@InputType('FormSystemUpdateGroupInput')
export class UpdateGroupInput {
  @Field(() => Int, { nullable: true })
  groupId!: number

  @Field(() => UpdateGroup, { nullable: true })
  groupUpdateDto?: UpdateGroup
}

@InputType('FormSystemGroupInput')
export class GroupInput {
  @Field(() => Int, { nullable: true })
  id?: number

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => ID, { nullable: true })
  guid?: string

  @Field(() => Int, { nullable: true })
  displayOrder?: number

  @Field(() => Boolean, { nullable: true })
  isHidden?: boolean

  @Field(() => [InputInput], { nullable: 'itemsAndList' })
  inputs?: InputInput[] | null

  @Field(() => Int, { nullable: true })
  stepId?: number

  @Field(() => Int, { nullable: true })
  multiSet?: number

  @Field(() => String, { nullable: true })
  stepGuid?: string
}

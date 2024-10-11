import { Field, ID, InputType, Int } from '@nestjs/graphql'
import { LanguageTypeInput } from './language.input'
import graphqlTypeJson from 'graphql-type-json'

@InputType('FormSystemInputCreation')
export class CreateInput {
  @Field(() => Int, { nullable: true })
  groupId?: number

  @Field(() => Int, { nullable: true })
  displayOrder?: number
}

@InputType('FormSystemInputUpdate')
export class UpdateInput {
  @Field(() => Int, { nullable: true })
  id?: number

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => LanguageTypeInput, { nullable: true })
  description?: LanguageTypeInput

  @Field()
  isRequired?: boolean

  @Field(() => Int, { nullable: true })
  displayOrder?: number

  @Field()
  isHidden?: boolean

  @Field(() => String, { nullable: true })
  type?: string

  @Field(() => graphqlTypeJson, { nullable: true })
  inputSettings?: object

  @Field()
  isPartOfMultiSet?: boolean

  @Field(() => Int, { nullable: true })
  groupId?: number
}

@InputType('FormSystemGetInputInput')
export class GetInputInput {
  @Field(() => Int)
  id!: number
}

@InputType('FormSystemCreateInputInput')
export class CreateInputInput {
  @Field(() => CreateInput, { nullable: true })
  inputCreationDto?: CreateInput
}

@InputType('FormSystemDeleteInputInput')
export class DeleteInputInput {
  @Field(() => Int)
  inputId!: number
}

@InputType('FormSystemUpdateInputInput')
export class UpdateInputInput {
  @Field(() => Int, { nullable: true })
  inputId!: number

  @Field(() => UpdateInput, { nullable: true })
  inputUpdateDto?: UpdateInput
}

@InputType('FormSystemInputInput')
export class InputInput {
  @Field(() => Int, { nullable: true })
  id?: number

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => LanguageTypeInput, { nullable: true })
  description?: LanguageTypeInput

  @Field()
  isRequired?: boolean

  @Field(() => Int, { nullable: true })
  displayOrder?: number

  @Field(() => Int, { nullable: true })
  groupId?: number

  @Field()
  isHidden?: boolean

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => ID, { nullable: true })
  guid?: string

  @Field()
  isPartOfMultiSet?: boolean

  @Field(() => String, { nullable: true })
  groupGuid?: string

  @Field(() => graphqlTypeJson, { nullable: true })
  inputSettings?: object

  @Field(() => graphqlTypeJson, { nullable: true })
  inputFields?: object
}

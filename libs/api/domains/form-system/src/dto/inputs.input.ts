import { Field, ID, InputType, Int } from "@nestjs/graphql"
import { LanguageTypeInput } from "./global.input"
import graphqlTypeJson from 'graphql-type-json'
import { InputSettingsInput } from "./inputSettings.input"

@InputType('FormSystemInputCreation')
export class CreateInput {
  @Field(() => Number, { nullable: true })
  groupId?: number

  @Field(() => Number, { nullable: true })
  displayOrder?: number
}

@InputType('FormSystemInputUpdate')
export class UpdateInput {
  @Field(() => ID, { nullable: true })
  id?: number

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => LanguageTypeInput, { nullable: true })
  description?: LanguageTypeInput

  @Field()
  isRequired?: boolean

  @Field(() => Number, { nullable: true })
  displayOrder?: number

  @Field()
  isHidden?: boolean

  @Field(() => String, { nullable: true })
  type?: string

  @Field(() => InputSettingsInput, { nullable: true })
  inputSettings?: InputSettingsInput

  @Field()
  isPartOfMultiSet?: boolean
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
  @Field(() => ID, { nullable: true })
  id?: number

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => LanguageTypeInput, { nullable: true })
  description?: LanguageTypeInput

  @Field()
  isRequired?: boolean

  @Field(() => Number, { nullable: true })
  displayOrder?: number

  @Field(() => Number, { nullable: true })
  groupId?: number

  @Field()
  isHidden?: boolean

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => String, { nullable: true })
  guid?: string

  @Field()
  isPartOfMultiSet?: boolean

  @Field(() => String, { nullable: true })
  groupGuid?: string

  @Field(() => InputSettingsInput, { nullable: true })
  inputSettings?: InputSettingsInput

  @Field(() => graphqlTypeJson, { nullable: true })
  inputFields?: object
}


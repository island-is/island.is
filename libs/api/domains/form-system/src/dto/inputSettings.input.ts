import { InputType, Field, Int, Float } from '@nestjs/graphql'
import { LanguageTypeInput } from './language.input'
import { ListItemInput } from './listItem.input'

@InputType('FormSystemInputSettingsInput')
export class InputSettingsInput {
  @Field(() => Boolean, { nullable: true })
  isLarge?: boolean

  @Field(() => String, { nullable: true })
  size?: string

  @Field(() => String, { nullable: true })
  interval?: string

  @Field(() => Boolean, { nullable: true })
  hasLink?: boolean

  @Field(() => String, { nullable: true })
  url?: string

  @Field(() => LanguageTypeInput, { nullable: true })
  buttonText?: LanguageTypeInput

  @Field(() => [String], { nullable: true })
  types?: string[]

  @Field(() => Int, { nullable: true })
  maxSize?: number

  @Field(() => Boolean, { nullable: true })
  isMulti?: boolean

  @Field(() => Float, { nullable: true })
  amount?: number

  @Field(() => String, { nullable: true })
  header?: string

  @Field(() => Int, { nullable: true })
  maxLength?: number

  @Field(() => Int, { nullable: true })
  minLength?: number

  @Field(() => Int, { nullable: true })
  min?: number

  @Field(() => Int, { nullable: true })
  max?: number

  @Field(() => [ListItemInput], { nullable: true })
  list?: ListItemInput[]

  @Field(() => String, { nullable: true })
  type?: string

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => Boolean, { nullable: true })
  isList?: boolean

  @Field(() => Boolean, { nullable: true })
  hasInput?: boolean
}

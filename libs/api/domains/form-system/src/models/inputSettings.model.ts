import { ObjectType, Field } from '@nestjs/graphql'
import { LanguageType } from './global.model'

@ObjectType('FormSystemListItem')
export class ListItem {
  @Field(() => String, { nullable: true })
  guid?: string

  @Field(() => LanguageType, { nullable: true })
  label?: LanguageType

  @Field(() => LanguageType, { nullable: true })
  description?: LanguageType

  @Field(() => Number, { nullable: true })
  displayOrder?: number

  @Field(() => Boolean, { nullable: true })
  isSelected?: boolean

  @Field(() => String, { nullable: true })
  value?: string
}

@ObjectType('FormSystemInputSettings')
export class InputSettings {
  @Field(() => Boolean, { nullable: true })
  isLarge?: boolean

  @Field(() => String, { nullable: true })
  size?: string

  @Field(() => String, { nullable: true })
  interval?: string

  @Field(() => Boolean, { nullable: true })
  hasLink?: boolean

  @Field(() => String, { nullable: true })
  url?: string | null

  @Field(() => LanguageType, { nullable: true })
  buttonText?: LanguageType

  @Field(() => [String], { nullable: true })
  types?: string[]

  @Field(() => Number, { nullable: true })
  maxSize?: number

  @Field(() => Boolean, { nullable: true })
  isMulti?: boolean

  @Field(() => Number, { nullable: true })
  amount?: number

  @Field(() => String, { nullable: true })
  header?: string

  @Field(() => Number, { nullable: true })
  maxLength?: number

  @Field(() => Number, { nullable: true })
  minLength?: number

  @Field(() => Number, { nullable: true })
  min?: number

  @Field(() => Number, { nullable: true })
  max?: number

  @Field(() => [ListItem], { nullable: true })
  list?: ListItem[]

  @Field(() => String, { nullable: true })
  type?: string

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => Boolean, { nullable: true })
  isList?: boolean

  @Field(() => Boolean, { nullable: true })
  hasInput?: boolean
}

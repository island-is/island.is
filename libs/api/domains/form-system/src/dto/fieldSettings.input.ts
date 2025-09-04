import { Field, InputType, Int } from '@nestjs/graphql'
import { ListItemInput } from './listItem.input'
import { LanguageTypeInput } from './languageType.input'

@InputType('FormSystemFieldSettingsInput')
export class FieldSettingsInput {
  @Field(() => Int, { nullable: true })
  minValue?: number

  @Field(() => Int, { nullable: true })
  maxValue?: number

  @Field(() => Int, { nullable: true })
  minLength?: number

  @Field(() => Int, { nullable: true })
  maxLength?: number

  @Field(() => Date, { nullable: true })
  minDate?: Date

  @Field(() => Date, { nullable: true })
  maxDate?: Date

  @Field(() => Int, { nullable: true })
  minAmount?: number

  @Field(() => Int, { nullable: true })
  maxAmount?: number

  @Field(() => Int, { nullable: true })
  year?: number

  @Field(() => Boolean, { nullable: true })
  hasLink?: boolean

  @Field(() => String, { nullable: true })
  url?: string

  @Field(() => LanguageTypeInput, { nullable: true })
  buttonText?: LanguageTypeInput

  @Field(() => Boolean, { nullable: true })
  hasPropertyInput?: boolean

  @Field(() => Boolean, { nullable: true })
  hasPropertyList?: boolean

  @Field(() => [ListItemInput], { nullable: 'itemsAndList' })
  list?: ListItemInput[]

  @Field(() => String, { nullable: true })
  listType?: string

  @Field(() => String, { nullable: true })
  fileTypes?: string

  @Field(() => Int, { nullable: true })
  fileMaxSize?: number

  @Field(() => Int, { nullable: true })
  maxFiles?: number

  @Field(() => String, { nullable: true })
  timeInterval?: string

  @Field(() => Boolean, { nullable: true })
  isLarge?: boolean

  @Field(() => Boolean, { nullable: true })
  zendeskIsPublic?: boolean

  @Field(() => Boolean, { nullable: true })
  zendeskIsCustomField?: boolean

  @Field(() => String, { nullable: true })
  zendeskCustomFieldId?: string

  @Field(() => String, { nullable: true })
  applicantType?: string
}

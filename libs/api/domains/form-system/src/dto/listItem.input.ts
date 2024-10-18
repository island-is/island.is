import { InputType, Field, ID } from '@nestjs/graphql'
import { LanguageTypeInput } from './language.input'

@InputType('FormSystemListItemInput')
export class ListItemInput {
  @Field(() => ID, { nullable: true })
  guid?: string

  @Field(() => LanguageTypeInput, { nullable: true })
  label?: LanguageTypeInput

  @Field(() => LanguageTypeInput, { nullable: true })
  description?: LanguageTypeInput

  @Field(() => Number, { nullable: true })
  displayOrder?: number

  @Field(() => Boolean, { nullable: true })
  isSelected?: boolean

  @Field(() => String, { nullable: true })
  value?: string
}

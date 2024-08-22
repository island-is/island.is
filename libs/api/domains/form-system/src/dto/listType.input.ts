import { Field, InputType } from '@nestjs/graphql'
import { LanguageTypeInput } from './languageType.input'

@InputType('FormSystemListTypeInput')
export class ListTypeInput {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => LanguageTypeInput, { nullable: true })
  description?: LanguageTypeInput

  @Field(() => String, { nullable: true })
  type?: string

  @Field(() => Boolean, { nullable: true })
  isCommon?: boolean
}

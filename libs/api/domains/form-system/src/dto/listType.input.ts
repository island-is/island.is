import { Field, Int, InputType } from '@nestjs/graphql'
import { LanguageTypeInput } from './language.input'

@InputType('FormSystemListTypeInput')
export class ListTypeInput {
  @Field(() => Int, { nullable: true })
  id?: number

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => LanguageTypeInput, { nullable: true })
  name?: LanguageTypeInput

  @Field(() => LanguageTypeInput, { nullable: true })
  description?: LanguageTypeInput
}

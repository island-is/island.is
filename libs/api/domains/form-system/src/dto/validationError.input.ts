import { Field, InputType } from '@nestjs/graphql'
import { LanguageTypeInput } from './languageType.input'

@InputType('FormSystemValidationErrorInput')
export class ValidationErrorInput {
  @Field(() => Boolean, { nullable: true })
  hasError?: boolean

  @Field(() => LanguageTypeInput, { nullable: true })
  title?: LanguageTypeInput

  @Field(() => LanguageTypeInput, { nullable: true })
  message?: LanguageTypeInput
}

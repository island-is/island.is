import { Field, InputType } from '@nestjs/graphql'
import { LanguageTypeInput } from './languageType.input'

@InputType('FormSystemCompletedSectionInfoInput')
export class CompletedSectionInfoInput {
  @Field(() => LanguageTypeInput)
  title?: LanguageTypeInput

  @Field(() => LanguageTypeInput)
  confirmationHeader!: LanguageTypeInput

  @Field(() => LanguageTypeInput)
  confirmationText!: LanguageTypeInput

  @Field(() => [LanguageTypeInput], { nullable: 'itemsAndList' })
  additionalInfo?: LanguageTypeInput[]
}

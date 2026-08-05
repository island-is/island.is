import { Field, InputType } from '@nestjs/graphql'
import { LanguageTypeInput } from './languageType.input'

@InputType('FormSystemAdditionalPremiseInput')
export class AdditionalPremiseInput {
  @Field(() => LanguageTypeInput)
  title!: LanguageTypeInput

  @Field(() => LanguageTypeInput)
  description!: LanguageTypeInput
}

@InputType('FormSystemSectionInfoInput')
export class SectionInfoInput {
  @Field(() => LanguageTypeInput)
  title!: LanguageTypeInput

  @Field(() => LanguageTypeInput)
  confirmationHeader!: LanguageTypeInput

  @Field(() => LanguageTypeInput)
  confirmationText!: LanguageTypeInput

  @Field(() => [LanguageTypeInput], { nullable: 'itemsAndList' })
  additionalInfo?: LanguageTypeInput[]

  @Field(() => [AdditionalPremiseInput], { nullable: 'itemsAndList' })
  additionalPremises?: AdditionalPremiseInput[]
}

import { Field, ObjectType } from '@nestjs/graphql'
import { LanguageType } from './languageType.model'

@ObjectType('FormSystemAdditionalPremise')
export class AdditionalPremise {
  @Field(() => LanguageType)
  title!: LanguageType

  @Field(() => LanguageType)
  description!: LanguageType
}

@ObjectType('FormSystemCompletedSectionInfo')
export class CompletedSectionInfo {
  @Field(() => LanguageType)
  title!: LanguageType

  @Field(() => LanguageType)
  confirmationHeader!: LanguageType

  @Field(() => LanguageType)
  confirmationText!: LanguageType

  @Field(() => [LanguageType])
  additionalInfo: LanguageType[] = []

  @Field(() => [AdditionalPremise])
  additionalPremises: AdditionalPremise[] = []
}

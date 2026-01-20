import { Field, ObjectType } from '@nestjs/graphql'
import { LanguageType } from './languageType.model'

@ObjectType('FormSystemCompletedSectionInfo')
export class CompletedSectionInfo {
  @Field(() => LanguageType)
  title?: LanguageType

  @Field(() => LanguageType)
  confirmationHeader!: LanguageType

  @Field(() => LanguageType)
  confirmationText!: LanguageType

  @Field(() => [LanguageType])
  additionalInfo: LanguageType[] = []
}

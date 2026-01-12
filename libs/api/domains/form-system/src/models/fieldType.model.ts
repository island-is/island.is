import { Field, ObjectType } from '@nestjs/graphql'
import { LanguageType } from './languageType.model'
import { FieldSettings } from './fieldSettings.model'
import { Value } from './value.model'

@ObjectType('FormSystemFieldType')
export class FieldType {
  @Field(() => String)
  id!: string

  @Field(() => LanguageType)
  name!: LanguageType

  @Field(() => LanguageType)
  description!: LanguageType

  @Field(() => Boolean)
  isCommon!: boolean

  @Field(() => FieldSettings, { nullable: true })
  fieldSettings?: FieldSettings

  @Field(() => [Value], { nullable: 'itemsAndList' })
  values?: Value[]
}

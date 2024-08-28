import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { LanguageType } from './languageType.model'
import { FieldSettings } from './fieldSettings.model'
import { FieldTypeDtoTypeEnum } from '@island.is/clients/form-system'

registerEnumType(FieldTypeDtoTypeEnum, {
  name: 'FormSystemFieldTypeDtoTypeEnum',
})

@ObjectType('FormSystemFieldType')
export class FieldType {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => FieldTypeDtoTypeEnum, { nullable: true })
  type?: FieldTypeDtoTypeEnum

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => LanguageType, { nullable: true })
  description?: LanguageType

  @Field(() => Boolean, { nullable: true })
  isCommon?: boolean

  @Field(() => FieldSettings, { nullable: true })
  fieldSettings?: FieldSettings
}

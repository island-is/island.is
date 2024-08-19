import { Field as FieldType, Int, ObjectType } from '@nestjs/graphql'
import { LanguageType } from './LanguageType.model'
import { FieldDtoFieldTypeEnum } from '@island.is/clients/form-system'
import { FieldSettings } from './fieldSettings.model'


@ObjectType('FormSystemField')
export class Field {
  @FieldType(() => String, { nullable: true })
  id?: string

  @FieldType(() => String, { nullable: true })
  screenId?: string

  @FieldType(() => LanguageType, { nullable: true })
  name?: LanguageType

  @FieldType(() => Int, { nullable: true })
  displayOrder?: number

  @FieldType(() => LanguageType, { nullable: true })
  description?: LanguageType

  @FieldType(() => Boolean, { nullable: true })
  isPartOfMultiset?: boolean

  @FieldType(() => FieldSettings, { nullable: true })
  fieldSettings?: FieldSettings

  @FieldType(() => FieldDtoFieldTypeEnum, { nullable: true })
  fieldType?: FieldDtoFieldTypeEnum
}


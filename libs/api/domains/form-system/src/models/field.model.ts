import { Field as FieldType, Int, ObjectType } from '@nestjs/graphql'
import { FieldSettings } from './fieldSettings.model'
import { LanguageType } from './languageType.model'
import { ListItem } from './listItem.model'
import { ValueDto } from './value.model'

@ObjectType('FormSystemField')
export class Field {
  @FieldType(() => String)
  id!: string

  @FieldType(() => String)
  screenId!: string

  @FieldType(() => LanguageType)
  name!: LanguageType

  @FieldType(() => Int, { nullable: true })
  displayOrder?: number

  @FieldType(() => LanguageType, { nullable: true })
  description?: LanguageType

  @FieldType(() => Boolean)
  isPartOfMultiset!: boolean

  @FieldType(() => FieldSettings, { nullable: true })
  fieldSettings?: FieldSettings

  @FieldType(() => String, { nullable: true })
  fieldType?: string

  @FieldType(() => [ListItem], { nullable: 'itemsAndList' })
  list?: ListItem[]

  @FieldType(() => [ValueDto], { nullable: 'itemsAndList' })
  values?: ValueDto[]

  @FieldType(() => Boolean, { nullable: true })
  isHidden?: boolean

  @FieldType(() => Boolean)
  isRequired!: boolean
}

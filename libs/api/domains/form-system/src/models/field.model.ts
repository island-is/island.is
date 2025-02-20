// import { Field as FieldType, Int, ObjectType } from '@nestjs/graphql'
// import { FieldSettings } from './fieldSettings.model'
// import { LanguageType } from './languageType.model'
// import { ListItem } from './listItem.model'
// import { ValueDto } from './value.model'

// @ObjectType('FormSystemField')
// export class Field {
//   @FieldType(() => String, { nullable: true })
//   id?: string

//   @FieldType(() => String, { nullable: true })
//   screenId?: string

//   @FieldType(() => LanguageType, { nullable: true })
//   name?: LanguageType

//   @FieldType(() => Int, { nullable: true })
//   displayOrder?: number

//   @FieldType(() => LanguageType, { nullable: true })
//   description?: LanguageType

//   @FieldType(() => Boolean, { nullable: true })
//   isPartOfMultiset?: boolean

//   @FieldType(() => FieldSettings, { nullable: true })
//   fieldSettings?: FieldSettings

//   @FieldType(() => String, { nullable: true })
//   fieldType?: string

//   @FieldType(() => [ListItem], { nullable: 'itemsAndList' })
//   list?: ListItem[]

//   @FieldType(() => [ValueDto], { nullable: 'itemsAndList' })
//   values?: ValueDto[]

//   @FieldType(() => Boolean, { nullable: true })
//   isHidden?: boolean

//   @FieldType(() => Boolean, { nullable: true })
//   isRequired?: boolean
// }

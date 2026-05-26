import { Field as FieldType, ObjectType } from '@nestjs/graphql'
import { ListItem } from './listItem.model'
import { LanguageType } from './languageType.model'

@ObjectType('FormSystemDataFromUrl')
export class DataFromUrl {
  @FieldType(() => [ListItem], { nullable: 'itemsAndList' })
  list?: ListItem[]

  @FieldType(() => LanguageType, { nullable: true })
  placeholder?: LanguageType

  @FieldType(() => Boolean, { nullable: true })
  isError?: boolean
}

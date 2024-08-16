import { Field as FieldType, Int, ObjectType } from '@nestjs/graphql'
import { LanguageType } from './LanguageType.model'


@ObjectType('FormSystemField')
export class Field {
  @FieldType(() => String, { nullable: true })
  id?: string

  @FieldType(() => LanguageType, { nullable: true })
  name?: LanguageType

  @FieldType(() => Date, { nullable: true })
  created?: Date

  @FieldType(() => Date, { nullable: true })
  modified?: Date

  @FieldType(() => Int, { nullable: true })
  displayOrder?: number

  @FieldType(() => LanguageType, { nullable: true })
  description?: LanguageType

  @FieldType(() => Boolean, { nullable: true })
  isHidden?: boolean

  @FieldType(() => Boolean, { nullable: true })
  isPartOfMultiSet?: boolean

}


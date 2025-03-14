import { Field, ObjectType, Int } from '@nestjs/graphql'
import { LanguageType } from './languageType.model'

@ObjectType('FormSystemListItem')
export class ListItem {
  @Field(() => String)
  id!: string

  @Field(() => LanguageType, { nullable: true })
  label?: LanguageType

  @Field(() => LanguageType, { nullable: true })
  description?: LanguageType

  @Field(() => String, { nullable: true })
  value?: string

  @Field(() => Int, { nullable: true })
  displayOrder?: number

  @Field(() => Boolean, { nullable: true })
  isSelected?: boolean
}

@ObjectType('FormSystemListType')
export class ListType {
  @Field(() => String, { nullable: true })
  id?: string

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => LanguageType, { nullable: true })
  description?: LanguageType

  @Field(() => String, { nullable: true })
  type?: string

  @Field(() => Boolean, { nullable: true })
  isCommon?: boolean
}

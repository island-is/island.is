import { ListItemDto } from '@island.is/form-system-dto'
import { Field, ObjectType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'

@ObjectType('FormSystemList')
export class List {
  @Field(() => String, { nullable: true })
  listType?: string

  @Field(() => [ListItemDto], { nullable: 'itemsAndList' })
  list?: ListItemDto[]
}

@ObjectType('FormSystemTranslation')
export class Translation {
  @Field(() => [graphqlTypeJson])
  translations: object[] = []

  @Field()
  sourceLanguageCode: string

  @Field()
  targetLanguageCode: string

  @Field()
  model: string

  constructor() {
    this.sourceLanguageCode = 'is'
    this.targetLanguageCode = 'en'
    this.model = ''
  }
}

import { Field, ObjectType } from '@nestjs/graphql'
import { ListItem } from './inputSettings.model'
import graphqlTypeJson from 'graphql-type-json'

@ObjectType('FormSystemList')
export class List {
  @Field(() => String, { nullable: true })
  listType?: string

  @Field(() => [ListItem], { nullable: 'itemsAndList' })
  list?: ListItem[]
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

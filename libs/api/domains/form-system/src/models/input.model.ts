import { Field, ID, ObjectType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'

import { InputSettings } from './inputSettings.model'
import { LanguageType } from './global.model'

@ObjectType('FormSystemInput')
export class Input {
  @Field(() => ID, { nullable: true })
  id?: number

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => LanguageType, { nullable: true })
  description?: LanguageType

  @Field()
  isRequired?: boolean

  @Field(() => Number, { nullable: true })
  displayOrder?: number

  @Field(() => Number, { nullable: true })
  groupId?: number

  @Field()
  isHidden?: boolean

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => String, { nullable: true })
  guid?: string

  @Field()
  isPartOfMultiSet?: boolean

  @Field(() => String, { nullable: true })
  groupGuid?: string

  @Field(() => InputSettings, { nullable: true })
  inputSettings?: InputSettings

  @Field(() => graphqlTypeJson, { nullable: true })
  inputFields?: object
}



import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'

import { InputSettings } from './inputSettings.model'
import { LanguageType } from './global.model'

@ObjectType('FormSystemInput')
export class Input {
  @Field(() => Int, { nullable: true })
  id?: number

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => LanguageType, { nullable: true })
  description?: LanguageType

  @Field(() => Boolean, { nullable: true })
  isRequired?: boolean

  @Field(() => Int, { nullable: true })
  displayOrder?: number

  @Field(() => Int, { nullable: true })
  groupId?: number

  @Field(() => Boolean, { nullable: true })
  isHidden?: boolean

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => ID, { nullable: true })
  guid?: string

  @Field(() => Boolean, { nullable: true })
  isPartOfMultiSet?: boolean

  @Field(() => String, { nullable: true })
  groupGuid?: string

  @Field(() => graphqlTypeJson, { nullable: true })
  inputSettings?: object

  @Field(() => graphqlTypeJson, { nullable: true })
  inputFields?: object
}

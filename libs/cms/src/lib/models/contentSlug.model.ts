/* eslint-disable @typescript-eslint/no-inferrable-types */
import { IsObject } from 'class-validator'
import graphqlTypeJson from 'graphql-type-json'
import { Field, ObjectType, ID } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'

@ObjectType()
export class TextFieldLocales {
  @Field()
  is?: string = ''

  @Field()
  en?: string = ''
}

@ObjectType()
export class ContentSlug {
  @Field(() => ID)
  id: string = ''

  @IsObject()
  @CacheField(() => TextFieldLocales, { nullable: true })
  slug: TextFieldLocales = {}

  @IsObject()
  @CacheField(() => TextFieldLocales, { nullable: true })
  title: TextFieldLocales = {}

  @IsObject()
  @CacheField(() => TextFieldLocales, { nullable: true })
  url: TextFieldLocales = {}

  @Field()
  type: string = ''

  @Field(() => graphqlTypeJson, { nullable: true })
  activeTranslations?: Record<string, boolean>
}

/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Field, ObjectType, ID } from '@nestjs/graphql'
import { IsObject } from 'class-validator'

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
  @Field(() => TextFieldLocales, { nullable: true })
  slug: TextFieldLocales = {}

  @IsObject()
  @Field(() => TextFieldLocales, { nullable: true })
  title: TextFieldLocales = {}

  @IsObject()
  @Field(() => TextFieldLocales, { nullable: true })
  url: TextFieldLocales = {}

  @Field()
  type: string = ''
}

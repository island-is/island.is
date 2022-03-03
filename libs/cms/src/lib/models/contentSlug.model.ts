/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Field, ID,ObjectType } from '@nestjs/graphql'
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

  @Field()
  type: string = ''
}

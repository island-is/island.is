/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Field, ObjectType, ID } from '@nestjs/graphql'
import { IsObject } from 'class-validator'

@ObjectType()
export class ContentSlugLocales {
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
  @Field(() => ContentSlugLocales, { nullable: true })
  slug: ContentSlugLocales = {}

  @Field()
  type: string = ''
}

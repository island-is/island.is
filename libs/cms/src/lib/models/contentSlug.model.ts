/* eslint-disable @typescript-eslint/no-inferrable-types */
import { Field, ObjectType, ID } from '@nestjs/graphql'
import { IArticle } from '../generated/contentfulTypes'

@ObjectType()
export class ContentSlug {
  @Field(() => ID)
  id: string = ''

  @Field()
  slug: string = ''

  // @Field()
  // currentSlug: string = ''

  @Field()
  type: string = ''
}

export const mapContentSlug = ({ fields, sys }: IArticle): ContentSlug => ({
  id: sys.id,
  slug: fields?.slug ?? '',
  // currentSlug: fields?.currentSlug ?? '',
  type: sys.contentType.sys.id,
})

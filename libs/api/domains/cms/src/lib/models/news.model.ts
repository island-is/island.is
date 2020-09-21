import { Field, ObjectType } from '@nestjs/graphql'

import { INews } from '../generated/contentfulTypes'

import { Image, mapImage } from './image.model'

@ObjectType()
export class News {
  @Field()
  id: string

  @Field()
  slug: string

  @Field()
  title: string

  @Field()
  subtitle: string

  @Field()
  intro: string

  @Field(() => Image, { nullable: true })
  image?: Image

  @Field()
  date: string

  @Field({ nullable: true })
  content?: string
}

export const mapNews = ({ fields, sys }: INews): News => ({
  id: sys.id,
  slug: fields.slug,
  title: fields.title,
  subtitle: fields.subtitle,
  intro: fields.intro,
  image: fields.image?.fields?.file ? mapImage(fields.image) : null,
  date: fields.date,
  content: JSON.stringify(fields.content),
})

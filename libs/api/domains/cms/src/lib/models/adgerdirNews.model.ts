import { Field, ObjectType } from '@nestjs/graphql'

import { IVidspyrnaNews } from '../generated/contentfulTypes'
import { AdgerdirPage, mapAdgerdirPage } from './adgerdirPage.model'
import { Image, mapImage } from './image.model'

@ObjectType()
export class AdgerdirNews {
  @Field()
  id: string

  @Field()
  slug: string

  @Field()
  subtitle: string

  @Field()
  title: string

  @Field()
  intro: string

  @Field(() => Image, { nullable: true })
  image?: Image

  @Field()
  date: string

  @Field({ nullable: true })
  content?: string

  @Field(() => [AdgerdirPage], { nullable: true })
  pages?: AdgerdirPage[]
}

export const mapAdgerdirNewsItem = ({
  fields,
  sys,
}: IVidspyrnaNews): AdgerdirNews => ({
  id: sys.id,
  slug: fields.slug,
  title: fields.title,
  subtitle: fields.subtitle,
  intro: fields.intro,
  image: fields.image?.fields?.file && mapImage(fields.image),
  date: fields.date,
  content: JSON.stringify(fields.content),
  pages: fields.pages && fields.pages.map(mapAdgerdirPage),
})

import { Field, ObjectType } from '@nestjs/graphql'
import { Image, mapImage } from './image.model'
import { INews } from '../generated/contentfulTypes'

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
  intro: fields.intro,
  image: mapImage(fields.image),
  date: fields.date,
  content: JSON.stringify(fields.content),
})

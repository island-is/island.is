import { Field, ObjectType } from '@nestjs/graphql'

import { ILandingPage } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { Link } from './link.model'
import { LinkList } from './linkList.model'

@ObjectType()
export class LandingPage {
  @Field()
  contentStatus: string

  @Field()
  title: string

  @Field()
  slug: string

  @Field()
  introduction: string

  @Field()
  image: Image

  @Field(() => Link, { nullable: true })
  actionButton?: Link

  @Field(() => LinkList, { nullable: true })
  links?: LinkList

  @Field({ nullable: true })
  content?: string
}

export const mapLandingPage = ({ fields }: ILandingPage): LandingPage => ({
  contentStatus: fields.contentStatus,
  title: fields.title,
  slug: fields.slug,
  introduction: fields.introduction,
  image: mapImage(fields.image),
  actionButton: fields.actionButton?.fields,
  links: fields.links?.fields,
  content: (fields.content && JSON.stringify(fields.content)) ?? null,
})

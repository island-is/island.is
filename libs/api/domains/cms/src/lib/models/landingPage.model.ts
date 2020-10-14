import { Field, ObjectType } from '@nestjs/graphql'

import { ILandingPage } from '../generated/contentfulTypes'

import { Image, mapImage } from './image.model'
import { Link, mapLink } from './link.model'
import { LinkList, mapLinkList } from './linkList.model'
import { Slice, mapDocument } from './slice.model'

@ObjectType()
export class LandingPage {
  @Field()
  title: string

  @Field()
  slug: string

  @Field()
  introduction: string

  @Field({ nullable: true })
  image: Image

  @Field({ nullable: true })
  actionButton: Link

  @Field({ nullable: true })
  links: LinkList

  @Field(() => [Slice])
  content: Array<typeof Slice>
}

export const mapLandingPage = ({ sys, fields }: ILandingPage): LandingPage => ({
  title: fields.title ?? '',
  slug: fields.slug ?? '',
  introduction: fields.introduction ?? '',
  image: mapImage(fields.image),
  actionButton: fields.actionButton ? mapLink(fields.actionButton) : null,
  links: fields.links ? mapLinkList(fields.links) : null,
  content: fields.content
    ? mapDocument(fields.content, sys.id + ':content')
    : [],
})

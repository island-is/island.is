import { Field, ObjectType } from '@nestjs/graphql'
import { ILandingPage } from '../generated/contentfulTypes'
import { mapDocument, SliceUnion } from '../unions/slice.union'
import { Image, mapImage } from './image.model'
import { Link, mapLink } from './link.model'
import { LinkList, mapLinkList } from './linkList.model'

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

  @Field(() => [SliceUnion])
  content: Array<typeof SliceUnion>
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

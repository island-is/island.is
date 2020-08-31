import { Field, ObjectType } from '@nestjs/graphql'
import { Image, mapImage } from './image.model'
import { Link, mapLink } from './link.model'
import { LinkList, mapLinkList } from './linkList.model'
import { Slice, mapDocument } from './slices/slice.model'
import { ILandingPage } from '../generated/contentfulTypes'

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

export const mapLandingPage = ({ fields }: ILandingPage): LandingPage => ({
  ...fields,
  image: fields.image && mapImage(fields.image),
  actionButton: fields.actionButton && mapLink(fields.actionButton),
  links: fields.links && mapLinkList(fields.links),
  content: fields.content && mapDocument(fields.content),
})

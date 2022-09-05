import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ISidebarCard } from '../generated/contentfulTypes'
import { Link, mapLink } from './link.model'
import { Image, mapImage } from './image.model'
import { SystemMetadata } from 'api-cms-domain'

@ObjectType()
export class SidebarCard {
  @Field(() => ID)
  id!: string

  @Field()
  type!: string

  @Field()
  title!: string

  @Field()
  contentString!: string

  @Field(() => Link, { nullable: true })
  link!: Link | null

  @Field(() => Image, { nullable: true })
  image?: Image | null
}

export const mapSidebarCard = ({
  sys,
  fields,
}: ISidebarCard): SystemMetadata<SidebarCard> => ({
  typename: 'SidebarCard',
  id: sys.id,
  type: fields.type ?? '',
  title: fields.title ?? '',
  contentString: fields.content ?? '',
  link: fields.link ? mapLink(fields.link) : null,
  image: fields.image ? mapImage(fields.image) : null,
})

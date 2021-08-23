import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ISidebarCard } from '../generated/contentfulTypes'
import { Link, mapLink } from './link.model'

@ObjectType()
export class SidebarCard {
  @Field(() => ID)
  id!: string

  @Field()
  type!: string

  @Field()
  title!: string

  @Field()
  content!: string

  @Field(() => Link, { nullable: true })
  link!: Link | null
}

export const mapSidebarCard = ({ sys, fields }: ISidebarCard): SidebarCard => ({
  id: sys.id,
  type: fields.type ?? '',
  title: fields.title ?? '',
  content: fields.content ?? '',
  link: fields.link ? mapLink(fields.link) : null,
})

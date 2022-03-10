import { Field, ID, ObjectType } from '@nestjs/graphql'

import { ILinkGroup } from '../generated/contentfulTypes'

import { Link, mapLink } from './link.model'

@ObjectType()
export class LinkGroup {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field(() => Link)
  primaryLink!: Link | null

  @Field(() => [Link])
  childrenLinks?: Array<Link>
}

export const mapLinkGroup = ({ fields, sys }: ILinkGroup): LinkGroup => ({
  id: sys.id,
  name: fields.name ?? '',
  primaryLink: fields.primaryLink ? mapLink(fields.primaryLink) : null,
  childrenLinks: (fields.childrenLinks ?? []).map(mapLink),
})

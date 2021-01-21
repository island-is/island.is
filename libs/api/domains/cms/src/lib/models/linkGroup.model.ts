import { Field, ObjectType } from '@nestjs/graphql'

import { ILinkGroup } from '../generated/contentfulTypes'

import { Link, mapLink } from './link.model'

@ObjectType()
export class LinkGroup {
  @Field()
  name: string

  @Field(() => Link)
  primaryLink: Link

  @Field(() => [Link])
  childrenLinks?: Array<Link>
}

export const mapLinkGroup = ({ fields }: ILinkGroup): LinkGroup => ({
  name: fields.name ?? '',
  primaryLink: mapLink(fields.primaryLink),
  childrenLinks: (fields.childrenLinks ?? []).map(mapLink),
})

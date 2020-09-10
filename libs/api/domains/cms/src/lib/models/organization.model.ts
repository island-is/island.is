import { Field, ObjectType, ID } from '@nestjs/graphql'

import { IOrganization } from '../generated/contentfulTypes'

import { OrganizationTag, mapOrganizationTag } from './organizationTag.model'

@ObjectType()
export class Organization {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  slug: string

  @Field(() => [OrganizationTag])
  tag?: Array<OrganizationTag>
}

export const mapOrganization = ({
  fields,
  sys,
}: IOrganization): Organization => ({
  id: sys.id,
  title: fields.title,
  slug: fields.slug,
  tag: fields.tag && fields.tag.map(mapOrganizationTag),
})

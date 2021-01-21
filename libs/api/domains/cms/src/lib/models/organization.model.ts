import { Field, ObjectType, ID } from '@nestjs/graphql'

import { IOrganization } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { OrganizationTag, mapOrganizationTag } from './organizationTag.model'

@ObjectType()
export class Organization {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field({ nullable: true })
  shortTitle: string

  @Field()
  slug: string

  @Field({ nullable: true })
  description?: string

  @Field(() => [OrganizationTag])
  tag?: Array<OrganizationTag>

  @Field({ nullable: true })
  logo?: Image

  @Field({ nullable: true })
  link?: string
}

export const mapOrganization = ({
  fields,
  sys,
}: IOrganization): Organization => ({
  id: sys.id,
  title: fields.title,
  shortTitle: fields.shortTitle ?? '',
  slug: fields.slug,
  description: fields.description ?? '',
  tag: (fields.tag ?? []).map(mapOrganizationTag),
  logo: mapImage(fields.logo),
  link: fields.link ?? '',
})

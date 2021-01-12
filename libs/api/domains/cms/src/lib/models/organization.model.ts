import { Field, ObjectType, ID } from '@nestjs/graphql'

import { IOrganization } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { OrganizationTag, mapOrganizationTag } from './organizationTag.model'
import { mapOrganizationPage, OrganizationPage } from './organizationPage.model'

@ObjectType()
export class Organization {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  shortTitle: string

  @Field({ nullable: true })
  description?: string

  @Field()
  slug: string

  @Field(() => [OrganizationTag])
  tag?: Array<OrganizationTag>

  @Field({ nullable: true })
  logo?: Image

  @Field()
  internalSite: boolean

  @Field({ nullable: true })
  link?: string

  @Field(() => OrganizationPage)
  organizationPage: OrganizationPage
}

export const mapOrganization = ({
  fields,
  sys,
}: IOrganization): Organization => ({
  id: sys.id,
  title: fields.title,
  shortTitle: fields.shortTitle,
  description: fields.description ?? '',
  slug: fields.slug,
  tag: (fields.tag ?? []).map(mapOrganizationTag),
  logo: mapImage(fields.logo),
  internalSite: fields.internalSite,
  link: fields.link ?? '',
  organizationPage: fields.organizationPage
    ? mapOrganizationPage(fields.organizationPage)
    : null,
})

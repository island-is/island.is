import { Field, ObjectType } from '@nestjs/graphql'

import { IOrganizationSubpage } from '../generated/contentfulTypes'

import { Link } from './link.model'
import {
  mapOrganizationSliceUnion,
  OrganizationSliceUnion,
} from '../unions/organizationSlice.union'
import { mapOrganizationPage, OrganizationPage } from './organizationPage.model'

@ObjectType()
export class OrganizationSubpage {
  @Field()
  title: string

  @Field()
  slug: string

  @Field({ nullable: true })
  description?: string

  @Field(() => [OrganizationSliceUnion])
  slices: Array<typeof OrganizationSliceUnion>

  @Field(() => Link, { nullable: true })
  menuItem?: Link

  @Field({ nullable: true })
  parentSubpage?: string

  @Field(() => OrganizationPage)
  organizationPage: OrganizationPage
}

export const mapOrganizationSubpage = ({
  fields,
}: IOrganizationSubpage): OrganizationSubpage => ({
  title: fields.title,
  slug: fields.slug,
  description: fields.description ?? '',
  slices: (fields.slices ?? []).map(mapOrganizationSliceUnion),
  menuItem: fields.menuItem?.fields,
  parentSubpage: fields.parentSubpage?.fields.slug,
  organizationPage: mapOrganizationPage(fields.organizationPage),
})

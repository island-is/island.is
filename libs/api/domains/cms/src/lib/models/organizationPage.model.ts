import { Field, ObjectType, ID } from '@nestjs/graphql'

import { IOrganizationPage } from '../generated/contentfulTypes'

import {
  mapOrganizationSliceUnion,
  OrganizationSliceUnion,
} from '../unions/organizationSlice.union'
import { mapOrganization, Organization } from './organization.model'
import { LinkGroup, mapLinkGroup } from './linkGroup.model'

@ObjectType()
export class OrganizationPage {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  slug: string

  @Field()
  description: string

  @Field(() => [OrganizationSliceUnion])
  slices: Array<typeof OrganizationSliceUnion>

  @Field(() => [LinkGroup])
  menuLinks?: Array<LinkGroup>

  @Field(() => Organization)
  organization: Organization
}

export const mapOrganizationPage = ({
  sys,
  fields,
}: IOrganizationPage): OrganizationPage => ({
  id: sys.id,
  title: fields.title,
  slug: fields.slug,
  description: fields.description,
  slices: fields.slices.map(mapOrganizationSliceUnion),
  menuLinks: (fields.menuLinks ?? []).map(mapLinkGroup),
  organization: mapOrganization(fields.organization),
})

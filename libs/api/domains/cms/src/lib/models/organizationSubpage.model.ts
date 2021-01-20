import { Field, ObjectType } from '@nestjs/graphql'

import { IOrganizationSubpage } from '../generated/contentfulTypes'

import { Link } from './link.model'
import { mapOrganization, Organization } from './organization.model'
import {
  mapOrganizationSliceUnion,
  OrganizationSliceUnion,
} from '../unions/organizationSlice.union'

@ObjectType()
export class OrganizationSubpage {
  @Field()
  title: string

  @Field(() => [OrganizationSliceUnion])
  slices: Array<typeof OrganizationSliceUnion>

  @Field(() => Link, { nullable: true })
  menuItem?: Link

  @Field()
  slug: string

  @Field({ nullable: true })
  parentSubpage?: string

  @Field(() => Organization)
  organization: Organization
}

export const mapOrganizationSubpage = ({
  fields,
}: IOrganizationSubpage): OrganizationSubpage => ({
  title: fields.title,
  slices: (fields.slices ?? []).map(mapOrganizationSliceUnion),
  menuItem: fields.menuItem?.fields,
  slug: fields.slug,
  parentSubpage: fields.parentSubpage?.fields.slug,
  organization: mapOrganization(fields.organization),
})

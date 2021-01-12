import { Field, ObjectType, ID } from '@nestjs/graphql'

import { IOrganizationPage } from '../generated/contentfulTypes'

import { Link, mapLink } from './link.model'

import {
  mapOrganizationSliceUnion,
  OrganizationSliceUnion,
} from '../unions/organizationSlice.union'

@ObjectType()
export class OrganizationPage {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  description: string

  @Field(() => [OrganizationSliceUnion])
  slices: Array<typeof OrganizationSliceUnion>

  @Field(() => [Link])
  menuLinks?: Array<Link>
}

export const mapOrganizationPage = ({
  sys,
  fields,
}: IOrganizationPage): OrganizationPage => ({
  id: sys.id,
  title: fields.title,
  description: fields.description,
  slices: fields.slices.map(mapOrganizationSliceUnion),
  menuLinks: (fields.menuLinks ?? []).map(mapLink),
})

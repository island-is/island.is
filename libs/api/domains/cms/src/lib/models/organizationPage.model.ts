import { Field, ObjectType, ID } from '@nestjs/graphql'

import { IOrganizationPage } from '../generated/contentfulTypes'
import { mapOrganization, Organization } from './organization.model'
import { LinkGroup, mapLinkGroup } from './linkGroup.model'
import { Image, mapImage } from './image.model'
import {safelyMapSliceUnion, SliceUnion} from "../unions/slice.union";

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

  @Field(() => [SliceUnion])
  slices: Array<typeof SliceUnion>

  @Field(() => [LinkGroup])
  menuLinks?: Array<LinkGroup>

  @Field(() => Organization)
  organization: Organization

  @Field({ nullable: true })
  featuredImage?: Image
}

export const mapOrganizationPage = ({
  sys,
  fields,
}: IOrganizationPage): OrganizationPage => ({
  id: sys.id,
  title: fields.title,
  slug: fields.slug,
  description: fields.description,
  slices: (fields.slices ?? []).map(safelyMapSliceUnion),
  menuLinks: (fields.menuLinks ?? []).map(mapLinkGroup),
  organization: mapOrganization(fields.organization),
  featuredImage: mapImage(fields.featuredImage),
})

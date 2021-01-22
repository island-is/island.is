import { Field, ObjectType } from '@nestjs/graphql'

import { IOrganizationSubpage } from '../generated/contentfulTypes'
import { Link, mapLink } from './link.model'
import { mapOrganizationPage, OrganizationPage } from './organizationPage.model'
import { Image, mapImage } from './image.model'
import { mapStaffCard, StaffCard } from './staffCard.model'
import {safelyMapSliceUnion, SliceUnion} from "../unions/slice.union";

@ObjectType()
export class OrganizationSubpage {
  @Field()
  title: string

  @Field()
  slug: string

  @Field({ nullable: true })
  description?: string

  @Field(() => [Link], { nullable: true })
  links?: Array<Link>

  @Field(() => [StaffCard], { nullable: true })
  sidebarCards: Array<StaffCard>

  @Field(() => [SliceUnion])
  slices: Array<typeof SliceUnion>

  @Field(() => Link, { nullable: true })
  menuItem?: Link

  @Field({ nullable: true })
  parentSubpage?: string

  @Field(() => OrganizationPage)
  organizationPage: OrganizationPage

  @Field({ nullable: true })
  featuredImage?: Image
}

export const mapOrganizationSubpage = ({
  fields,
}: IOrganizationSubpage): OrganizationSubpage => ({
  title: fields.title,
  slug: fields.slug,
  description: fields.description ?? '',
  links: (fields.links ?? []).map(mapLink),
  sidebarCards: (fields.sidebarCards ?? []).map(mapStaffCard),
  slices: (fields.slices ?? []).map(safelyMapSliceUnion),
  menuItem: fields.menuItem?.fields,
  parentSubpage: fields.parentSubpage?.fields.slug,
  organizationPage: mapOrganizationPage(fields.organizationPage),
  featuredImage: mapImage(fields.featuredImage),
})

import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IOrganizationSubpage } from '../generated/contentfulTypes'
import { Link, mapLink } from './link.model'
import { mapOrganizationPage, OrganizationPage } from './organizationPage.model'
import { Image, mapImage } from './image.model'
import { safelyMapSliceUnion, SliceUnion } from '../unions/slice.union'

@ObjectType()
export class OrganizationSubpage {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  slug: string

  @Field({ nullable: true })
  description?: string

  @Field(() => [Link], { nullable: true })
  links?: Array<Link>

  @Field(() => [SliceUnion], { nullable: true })
  slices: Array<typeof SliceUnion>

  @Field({ nullable: true })
  sliceCustomRenderer?: string

  @Field({ nullable: true })
  sliceExtraText?: string

  @Field({ nullable: true })
  parentSubpage?: string

  @Field(() => OrganizationPage)
  organizationPage: OrganizationPage

  @Field({ nullable: true })
  featuredImage?: Image
}

export const mapOrganizationSubpage = ({
  fields,
  sys,
}: IOrganizationSubpage): OrganizationSubpage => ({
  id: sys.id,
  title: fields.title ?? '',
  slug: fields.slug ?? '',
  description: fields.description ?? '',
  links: (fields.links ?? []).map(mapLink),
  slices: (fields.slices ?? []).map(safelyMapSliceUnion),
  sliceCustomRenderer: fields.sliceCustomRenderer ?? '',
  sliceExtraText: fields.sliceExtraText ?? '',
  parentSubpage: fields.parentSubpage?.fields.slug,
  organizationPage: fields.organizationPage
    ? mapOrganizationPage(fields.organizationPage)
    : null,
  featuredImage: fields.featuredImage ? mapImage(fields.featuredImage) : null,
})

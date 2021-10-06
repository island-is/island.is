import { Field, ObjectType, ID } from '@nestjs/graphql'

import { IOrganizationPage } from '../generated/contentfulTypes'
import { mapOrganization, Organization } from './organization.model'
import { LinkGroup, mapLinkGroup } from './linkGroup.model'
import { Image, mapImage } from './image.model'
import { safelyMapSliceUnion, SliceUnion } from '../unions/slice.union'
import { FooterItem, mapFooterItem } from './footerItem.model'
import { mapSidebarCard, SidebarCard } from './sidebarCard.model'
import {
  mapOrganizationTheme,
  OrganizationTheme,
} from './organizationTheme.model'
import { GenericTag, mapGenericTag } from './genericTag.model'

@ObjectType()
export class OrganizationPage {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  slug!: string

  @Field()
  description!: string

  @Field()
  theme!: string

  @Field()
  themeProperties!: OrganizationTheme

  @Field(() => [SliceUnion])
  slices!: Array<typeof SliceUnion | null>

  @Field(() => [SliceUnion])
  bottomSlices!: Array<typeof SliceUnion | null>

  @Field(() => GenericTag, { nullable: true })
  newsTag!: GenericTag | null

  @Field(() => [LinkGroup])
  menuLinks!: Array<LinkGroup>

  @Field(() => LinkGroup, { nullable: true })
  secondaryMenu!: LinkGroup | null

  @Field(() => Organization)
  organization!: Organization | null

  @Field(() => Image, { nullable: true })
  featuredImage!: Image | null

  @Field(() => [FooterItem])
  footerItems!: Array<FooterItem>

  @Field(() => [SidebarCard])
  sidebarCards!: Array<SidebarCard>
}

export const mapOrganizationPage = ({
  sys,
  fields,
}: IOrganizationPage): OrganizationPage => ({
  id: sys.id,
  title: fields.title ?? '',
  slug: fields.slug ?? '',
  description: fields.description ?? '',
  theme: fields.theme ?? 'default',
  themeProperties: mapOrganizationTheme(fields.themeProperties ?? {}),
  slices: (fields.slices ?? []).map(safelyMapSliceUnion),
  bottomSlices: (fields.bottomSlices ?? []).map(safelyMapSliceUnion),
  newsTag: fields.newsTag ? mapGenericTag(fields.newsTag) : null,
  menuLinks: (fields.menuLinks ?? []).map(mapLinkGroup),
  secondaryMenu: fields.secondaryMenu
    ? mapLinkGroup(fields.secondaryMenu)
    : null,
  organization: fields.organization
    ? mapOrganization(fields.organization)
    : null,
  featuredImage: fields.featuredImage ? mapImage(fields.featuredImage) : null,
  footerItems: (fields.footerItems ?? []).map(mapFooterItem),
  sidebarCards: (fields.sidebarCards ?? []).map(mapSidebarCard),
})

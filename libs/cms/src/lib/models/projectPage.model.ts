import { Field, ObjectType, ID } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'
import { CacheField } from '@island.is/nest/graphql'

import { IProjectPage } from '../generated/contentfulTypes'
import {
  mapDocument,
  safelyMapSliceUnion,
  SliceUnion,
} from '../unions/slice.union'
import { GenericTag, mapGenericTag } from './genericTag.model'
import { mapProjectSubpage, ProjectSubpage } from './projectSubpage.model'
import { mapStepper, Stepper } from './stepper.model'
import { mapImage, Image } from './image.model'
import { LinkGroup, mapLinkGroup } from './linkGroup.model'
import { FooterItem, mapFooterItem } from './footerItem.model'
import { Link, mapLink } from './link.model'
import { mapNamespace, Namespace } from './namespace.model'

@ObjectType()
export class ProjectPage {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  slug!: string

  @Field()
  theme!: string

  @Field()
  sidebar!: boolean

  @CacheField(() => [LinkGroup])
  sidebarLinks!: Array<LinkGroup>

  @CacheField(() => LinkGroup, { nullable: true })
  secondarySidebar?: LinkGroup | null

  @Field()
  subtitle!: string

  @Field()
  intro!: string

  @CacheField(() => [SliceUnion], { nullable: true })
  content?: Array<typeof SliceUnion>

  @CacheField(() => Stepper, { nullable: true })
  stepper!: Stepper | null

  @CacheField(() => [SliceUnion])
  slices!: Array<typeof SliceUnion | null>

  @CacheField(() => [SliceUnion])
  bottomSlices!: Array<typeof SliceUnion | null>

  @CacheField(() => GenericTag, { nullable: true })
  newsTag!: GenericTag | null

  @CacheField(() => [ProjectSubpage])
  projectSubpages!: Array<ProjectSubpage>

  @CacheField(() => Image, { nullable: true })
  featuredImage!: Image | null

  @CacheField(() => Image, { nullable: true })
  defaultHeaderImage!: Image | null

  @Field()
  defaultHeaderBackgroundColor!: string

  @Field()
  featuredDescription!: string

  @CacheField(() => GraphQLJSON, { nullable: true })
  footerConfig?: { background?: string; textColor?: string } | null

  @CacheField(() => [FooterItem], { nullable: true })
  footerItems?: FooterItem[]

  @CacheField(() => Link, { nullable: true })
  backLink?: Link | null

  @Field(() => Boolean, { nullable: true })
  contentIsFullWidth?: boolean

  @CacheField(() => Namespace, { nullable: true })
  namespace?: Namespace | null
}

export const mapProjectPage = ({ sys, fields }: IProjectPage): ProjectPage => ({
  id: sys.id,
  title: fields.title ?? '',
  slug: fields.slug ?? '',
  theme: fields.theme ?? 'default',
  sidebar: fields.sidebar ?? false,
  sidebarLinks: (fields.sidebarLinks ?? [])
    .map(mapLinkGroup)
    .filter((link) => Boolean(link.primaryLink)),
  secondarySidebar: fields.secondarySidebar
    ? mapLinkGroup(fields.secondarySidebar)
    : null,
  subtitle: fields.subtitle ?? '',
  intro: fields.intro ?? '',
  content: fields.content
    ? mapDocument(fields.content, sys.id + ':content')
    : [],
  stepper: fields.stepper ? mapStepper(fields.stepper) : null,
  slices: (fields.slices ?? []).map(safelyMapSliceUnion).filter(Boolean),
  bottomSlices: (fields.bottomSlices ?? [])
    .map(safelyMapSliceUnion)
    .filter(Boolean),
  newsTag: fields.newsTag ? mapGenericTag(fields.newsTag) : null,
  projectSubpages: (fields.projectSubpages ?? [])
    .filter((p) => p.fields?.title)
    .map(mapProjectSubpage),
  featuredImage: fields.featuredImage ? mapImage(fields.featuredImage) : null,
  defaultHeaderImage: fields.defaultHeaderImage
    ? mapImage(fields.defaultHeaderImage)
    : null,
  defaultHeaderBackgroundColor: fields.defaultHeaderBackgroundColor ?? '',
  featuredDescription: fields.featuredDescription ?? '',
  footerItems: fields.footerItems ? fields.footerItems.map(mapFooterItem) : [],
  footerConfig: fields.footerConfig,
  backLink: fields.backLink ? mapLink(fields.backLink) : null,
  contentIsFullWidth: fields.contentIsFullWidth ?? false,
  namespace: fields.namespace ? mapNamespace(fields.namespace) : null,
})

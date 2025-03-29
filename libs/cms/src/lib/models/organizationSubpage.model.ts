import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'

import { IOrganizationSubpage } from '../generated/contentfulTypes'
import { Link, mapLink } from './link.model'
import { mapOrganizationPage, OrganizationPage } from './organizationPage.model'
import { Image, mapImage } from './image.model'
import {
  mapDocument,
  safelyMapSliceUnion,
  SliceUnion,
} from '../unions/slice.union'
import { EmbeddedVideo, mapEmbeddedVideo } from './embeddedVideo.model'
import { SystemMetadata } from '@island.is/shared/types'

@ObjectType()
export class OrganizationSubpage {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field(() => String, { nullable: true })
  shortTitle?: string

  @Field()
  slug!: string

  @Field(() => [String])
  url!: Array<string>

  @Field({ nullable: true })
  intro?: string

  @CacheField(() => [SliceUnion], { nullable: true })
  description?: Array<typeof SliceUnion>

  @CacheField(() => [Link], { nullable: true })
  links?: Array<Link>

  @CacheField(() => [SliceUnion], { nullable: true })
  slices?: Array<typeof SliceUnion | null>

  @Field(() => Boolean)
  showTableOfContents?: boolean

  @Field({ nullable: true })
  sliceCustomRenderer?: string

  @Field({ nullable: true })
  sliceExtraText?: string

  @CacheField(() => OrganizationPage)
  organizationPage!: OrganizationPage | null

  @CacheField(() => Image, { nullable: true })
  featuredImage?: Image | null

  @CacheField(() => EmbeddedVideo, { nullable: true })
  signLanguageVideo?: EmbeddedVideo | null

  @CacheField(() => [SliceUnion], { nullable: true })
  bottomSlices?: Array<typeof SliceUnion | null>
}

export const mapOrganizationSubpage = ({
  fields,
  sys,
}: IOrganizationSubpage): SystemMetadata<OrganizationSubpage> => {
  const url = [fields.organizationPage?.fields?.slug ?? '']
  if (fields.organizationParentSubpage?.fields?.slug) {
    url.push(fields.organizationParentSubpage.fields.slug)
  }
  url.push(fields.slug ?? '')
  return {
    typename: 'OrganizationSubpage',
    id: sys.id,
    title: fields.title ?? '',
    shortTitle: fields.shortTitle || fields.title,
    slug: (fields.slug ?? '').trim(),
    url,
    intro: fields.intro ?? '',
    description:
      fields.description &&
      fields.sliceCustomRenderer !== 'SliceTableOfContents'
        ? mapDocument(fields.description, sys.id + ':content')
        : [],
    links: (fields.links ?? []).map(mapLink),
    slices: (fields.slices ?? []).map(safelyMapSliceUnion).filter(Boolean),
    showTableOfContents: fields.showTableOfContents ?? false,
    sliceCustomRenderer: fields.sliceCustomRenderer ?? '',
    sliceExtraText: fields.sliceExtraText ?? '',
    organizationPage: fields.organizationPage
      ? mapOrganizationPage(fields.organizationPage)
      : null,
    featuredImage: fields.featuredImage ? mapImage(fields.featuredImage) : null,
    signLanguageVideo: fields.signLanguageVideo
      ? mapEmbeddedVideo(fields.signLanguageVideo)
      : null,
    bottomSlices: (fields.bottomSlices ?? [])
      .map(safelyMapSliceUnion)
      .filter(Boolean),
  }
}

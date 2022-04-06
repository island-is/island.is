import { Field, ObjectType, ID } from '@nestjs/graphql'

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

  @Field(() => [LinkGroup])
  sidebarLinks!: Array<LinkGroup>

  @Field()
  subtitle!: string

  @Field()
  intro!: string

  @Field(() => [SliceUnion], { nullable: true })
  content?: Array<typeof SliceUnion>

  @Field(() => Stepper, { nullable: true })
  stepper!: Stepper | null

  @Field(() => [SliceUnion])
  slices!: Array<typeof SliceUnion | null>

  @Field(() => GenericTag, { nullable: true })
  newsTag!: GenericTag | null

  @Field(() => [ProjectSubpage])
  projectSubpages!: Array<ProjectSubpage>

  @Field(() => Image, { nullable: true })
  featuredImage!: Image | null

  @Field(() => Image, { nullable: true })
  defaultHeaderImage!: Image | null

  @Field()
  defaultHeaderBackgroundColor!: string

  @Field()
  featuredDescription!: string
}

export const mapProjectPage = ({ sys, fields }: IProjectPage): ProjectPage => ({
  id: sys.id,
  title: fields.title ?? '',
  slug: fields.slug ?? '',
  theme: fields.theme ?? 'default',
  sidebar: fields.sidebar ?? false,
  sidebarLinks: (fields.sidebarLinks ?? []).map(mapLinkGroup),
  subtitle: fields.subtitle ?? '',
  intro: fields.intro ?? '',
  content: fields.content
    ? mapDocument(fields.content, sys.id + ':content')
    : [],
  stepper: fields.stepper ? mapStepper(fields.stepper) : null,
  slices: (fields.slices ?? []).map(safelyMapSliceUnion),
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
})

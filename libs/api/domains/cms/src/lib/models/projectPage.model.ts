import { Field, ObjectType, ID } from '@nestjs/graphql'

import { IProjectPage } from '../generated/contentfulTypes'
import {
  mapDocument,
  safelyMapSliceUnion,
  SliceUnion,
} from '../unions/slice.union'
import { GenericTag, mapGenericTag } from './genericTag.model'
import { Link, mapLink } from './link.model'
import { mapProjectSubpage, ProjectSubpage } from './projectSubpage.model'
import { mapStepper, Stepper } from './stepper.model'
import { mapImage, Image } from './image.model'

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

  @Field(() => [Link])
  sidebarLinks!: Array<Link>

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
}

export const mapProjectPage = ({ sys, fields }: IProjectPage): ProjectPage => ({
  id: sys.id,
  title: fields.title ?? '',
  slug: fields.slug ?? '',
  theme: fields.theme ?? 'default',
  sidebar: fields.sidebar ?? false,
  sidebarLinks: (fields.sidebarLinks ?? []).map(mapLink),
  subtitle: fields.subtitle ?? '',
  intro: fields.intro ?? '',
  content: fields.content
    ? mapDocument(fields.content, sys.id + ':content')
    : [],
  stepper: fields.stepper ? mapStepper(fields.stepper) : null,
  slices: (fields.slices ?? []).map(safelyMapSliceUnion),
  newsTag: fields.newsTag ? mapGenericTag(fields.newsTag) : null,
  projectSubpages: (fields.projectSubpages ?? []).map(mapProjectSubpage),
  featuredImage: fields.featuredImage ? mapImage(fields.featuredImage) : null,
})

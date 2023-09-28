import { Field, ObjectType, ID } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'

import { IProjectSubpage } from '../generated/contentfulTypes'
import {
  mapDocument,
  safelyMapSliceUnion,
  SliceUnion,
} from '../unions/slice.union'

@ObjectType()
export class ProjectSubpage {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  slug!: string

  @CacheField(() => [SliceUnion], { nullable: true })
  content?: Array<typeof SliceUnion>

  @Field(() => Boolean)
  renderSlicesAsTabs: boolean | undefined

  @CacheField(() => [SliceUnion])
  slices!: Array<typeof SliceUnion | null>

  @Field(() => Boolean)
  showTableOfContents?: boolean

  @CacheField(() => [SliceUnion], { nullable: true })
  bottomSlices?: Array<typeof SliceUnion | null> | null
}

export const mapProjectSubpage = ({
  sys,
  fields,
}: IProjectSubpage): ProjectSubpage => ({
  id: sys.id,
  title: fields.title ?? '',
  slug: fields.slug ?? '',
  content: fields.content
    ? mapDocument(fields.content, sys.id + ':content')
    : [],
  renderSlicesAsTabs: fields.renderSlicesAsTabs ?? false,
  slices: (fields.slices ?? []).map(safelyMapSliceUnion).filter(Boolean),
  showTableOfContents: fields.showTableOfContents ?? false,
  bottomSlices: (fields.bottomSlices ?? [])
    .map(safelyMapSliceUnion)
    .filter(Boolean),
})

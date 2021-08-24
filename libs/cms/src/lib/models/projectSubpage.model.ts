import { Field, ObjectType, ID } from '@nestjs/graphql'

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

  @Field(() => [SliceUnion], { nullable: true })
  content?: Array<typeof SliceUnion>

  @Field(() => [SliceUnion])
  slices!: Array<typeof SliceUnion | null>
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
  slices: (fields.slices ?? []).map(safelyMapSliceUnion),
})

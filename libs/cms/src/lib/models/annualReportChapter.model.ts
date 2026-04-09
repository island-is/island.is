import { Field, ObjectType, ID } from '@nestjs/graphql'
import { IAnnualReportChapter } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { CacheField } from '@island.is/nest/graphql'
import { SliceUnion, mapDocument } from '../unions/slice.union'

@ObjectType()
export class AnnualReportChapter {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  slug!: string

  @Field({ nullable: true })
  intro?: string

  @CacheField(() => Image)
  thumbnailImage!: Image

  @CacheField(() => [SliceUnion])
  content!: Array<typeof SliceUnion>
}

export const mapAnnualReportChapter = ({
  fields,
  sys,
}: IAnnualReportChapter): AnnualReportChapter => ({
  id: sys.id,
  title: fields.title,
  slug: fields.slug,
  intro: fields.intro ?? '',
  thumbnailImage: mapImage(fields.thumbnailImage),
  content: fields.content
    ? mapDocument(fields.content, sys.id + ':content')
    : [],
})

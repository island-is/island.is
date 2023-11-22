import { Field, ID, ObjectType } from '@nestjs/graphql'
import { SystemMetadata } from '@island.is/shared/types'
import { IManual, IManualChapter } from '../generated/contentfulTypes'
import { CacheField } from '@island.is/nest/graphql'
import { SliceUnion, mapDocument } from '../unions/slice.union'
import {
  ManualChapterItem,
  mapManualChapterItem,
} from './manualChapterItem.model'

@ObjectType()
class ManualChapterChangelog {
  @CacheField(() => [ManualChapterChangelogItem])
  items!: ManualChapterChangelogItem[]
}

@ObjectType()
class ManualChapterChangelogItem {
  @Field()
  dateOfChange!: string

  @Field()
  textualDescription!: string
}

@ObjectType()
export class ManualChapter {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  slug!: string

  @CacheField(() => [SliceUnion], { nullable: true })
  description?: Array<typeof SliceUnion>

  @CacheField(() => [ManualChapterItem])
  chapterItems!: ManualChapterItem[]

  @CacheField(() => ManualChapterChangelog, { nullable: true })
  changelog?: ManualChapterChangelog | null
}

export const mapManualChapter = ({
  chapter,
  manual,
}: {
  chapter: IManualChapter
  manual: IManual
}): SystemMetadata<ManualChapter> => {
  const { sys, fields } = chapter
  return {
    typename: 'ManualChapter',
    id: sys.id,
    slug: fields.slug,
    title: fields.title,
    chapterItems: fields.chapterItems
      ? fields.chapterItems.map((item) =>
          mapManualChapterItem({ item, manual, chapter }),
        )
      : [],
    changelog: fields.changelog as ManualChapterChangelog,
    description: fields.description
      ? mapDocument(fields.description, sys.id + ':description')
      : [],
  }
}

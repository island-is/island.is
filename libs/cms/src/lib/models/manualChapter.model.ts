import { Field, ID, ObjectType } from '@nestjs/graphql'
import { SystemMetadata } from '@island.is/shared/types'
import { IManualChapter } from '../generated/contentfulTypes'
import { CacheField } from '@island.is/nest/graphql'
import { OneColumnText, mapOneColumnText } from './oneColumnText.model'
import { SliceUnion, mapDocument } from '../unions/slice.union'

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

  @CacheField(() => [OneColumnText])
  chapterItems!: OneColumnText[]

  @CacheField(() => ManualChapterChangelog, { nullable: true })
  changelog?: ManualChapterChangelog | null
}

export const mapManualChapter = ({
  sys,
  fields,
}: IManualChapter): SystemMetadata<ManualChapter> => {
  return {
    typename: 'ManualChapter',
    id: sys.id,
    slug: fields.slug,
    title: fields.title,
    // TODO: test out mapping this when we've got draft one column text items in a published chapter
    chapterItems: fields.chapterItems
      ? fields.chapterItems.map(mapOneColumnText)
      : [],
    changelog: fields.changelog as ManualChapterChangelog,
    // TODO: What if this is empty?
    description: fields.description
      ? mapDocument(fields.description, sys.id + ':description')
      : [],
  }
}

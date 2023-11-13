import { CacheField } from '@island.is/nest/graphql'
import { ObjectType, Field, ID } from '@nestjs/graphql'
import {
  IOneColumnText,
  IManual,
  IManualChapter,
} from '../generated/contentfulTypes'
import { SliceUnion, mapDocument } from '../unions/slice.union'
import { SystemMetadata } from '@island.is/shared/types'

@ObjectType()
export class ManualChapterItem {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @CacheField(() => [SliceUnion], { nullable: true })
  content?: Array<typeof SliceUnion>

  @Field()
  manualSlug!: string

  @Field()
  manualChapterSlug!: string
}

export const mapManualChapterItem = ({
  item,
  manual,
  chapter,
}: {
  item: IOneColumnText
  manual: IManual
  chapter: IManualChapter
}): SystemMetadata<ManualChapterItem> => {
  return {
    typename: 'ManualChapterItem',
    id: item.sys.id,
    title: item.fields.title ?? '',
    content: item.fields.content
      ? mapDocument(item.fields.content, item.sys.id + ':content')
      : [],
    manualSlug: manual.fields.slug,
    manualChapterSlug: chapter.fields.slug,
  }
}

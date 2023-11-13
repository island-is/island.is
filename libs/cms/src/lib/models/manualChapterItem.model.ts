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
class ManualPageData {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  slug!: string
}

@ObjectType()
export class ManualChapterItem {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @CacheField(() => [SliceUnion], { nullable: true })
  content?: Array<typeof SliceUnion>

  @CacheField(() => ManualPageData)
  manual!: ManualPageData

  @CacheField(() => ManualPageData)
  manualChapter!: ManualPageData
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
    manual: {
      id: manual.sys.id,
      title: manual.fields.title,
      slug: manual.fields.slug,
    },
    manualChapter: {
      id: chapter.sys.id,
      title: chapter.fields.title,
      slug: chapter.fields.slug,
    },
  }
}

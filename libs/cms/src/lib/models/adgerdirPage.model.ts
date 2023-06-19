import { Field, ObjectType, ID } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'
import { IVidspyrnaPage } from '../generated/contentfulTypes'
import { AdgerdirTag, mapAdgerdirTag } from './adgerdirTag.model'
import { mapProcessEntry, ProcessEntry } from './processEntry.model'
import { mapDocument, SliceUnion } from '../unions/slice.union'

@ObjectType()
export class AdgerdirPage {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  description!: string

  @Field({ nullable: true })
  longDescription?: string

  @CacheField(() => [SliceUnion])
  content: Array<typeof SliceUnion> = []

  @Field({ nullable: true })
  objective?: string

  @Field()
  slug!: string

  @CacheField(() => [AdgerdirTag])
  tags!: AdgerdirTag[]

  @Field({ nullable: true })
  link?: string

  @Field({ nullable: true })
  linkButtonText?: string

  @Field()
  status!: string

  @Field({ nullable: true })
  estimatedCostIsk?: number

  @Field({ nullable: true })
  finalCostIsk?: number

  @CacheField(() => ProcessEntry, { nullable: true })
  processEntry?: ProcessEntry | null
}

export const mapAdgerdirPage = ({
  sys,
  fields,
}: IVidspyrnaPage): SystemMetadata<AdgerdirPage> => ({
  typename: 'AdgerdirPage',
  id: sys?.id ?? '',
  slug: fields?.slug ?? '',
  title: fields?.title ?? '',
  description: fields?.description ?? '',
  longDescription: fields?.longDescription,
  objective: '',
  tags: (fields?.tags ?? []).map(mapAdgerdirTag),
  status: '',
  link: fields?.link ?? '',
  linkButtonText: fields?.linkButtonText ?? '',
  content:
    sys?.id && fields?.content
      ? mapDocument(fields.content, sys.id + ':content')
      : [],
  processEntry: fields?.processEntry
    ? mapProcessEntry(fields.processEntry)
    : null,
})

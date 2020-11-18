import { Field, ObjectType, ID } from '@nestjs/graphql'

import { IVidspyrnaPage } from '../generated/contentfulTypes'
import { Slice, mapDocument } from './slice.model'

import { AdgerdirTag, mapAdgerdirTag } from './adgerdirTag.model'

@ObjectType()
export class AdgerdirPage {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  description: string

  @Field({ nullable: true })
  longDescription?: string

  @Field(() => [Slice])
  content: Array<typeof Slice>

  @Field({ nullable: true })
  objective?: string

  @Field()
  slug: string

  @Field(() => [AdgerdirTag])
  tags: AdgerdirTag[]

  @Field({ nullable: true })
  link?: string

  @Field({ nullable: true })
  linkButtonText?: string

  @Field()
  status: string

  @Field({ nullable: true })
  estimatedCostIsk?: number

  @Field({ nullable: true })
  finalCostIsk?: number
}

export const mapAdgerdirPage = ({
  sys,
  fields,
}: IVidspyrnaPage): AdgerdirPage => ({
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
})

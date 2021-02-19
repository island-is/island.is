import { Field, ObjectType } from '@nestjs/graphql'

import { IVidspyrnaPage } from '../generated/contentfulTypes'

import { VidspyrnaTag, mapVidspyrnaTag } from './vidspyrnaTag.model'
import { ProcessEntry } from './processEntry.model'

@ObjectType()
export class VidspyrnaPage {
  @Field()
  title: string

  @Field()
  slug: string

  @Field()
  description: string

  @Field({ nullable: true })
  longDescription?: string

  @Field({ nullable: true })
  content?: string

  @Field({ nullable: true })
  link?: string

  @Field({ nullable: true })
  linkButtonText?: string

  @Field(() => [VidspyrnaTag])
  tags: Array<VidspyrnaTag>

  @Field(() => ProcessEntry, { nullable: true })
  processEntry?: ProcessEntry
}

export const mapVidspyrnaPage = ({
  fields,
}: IVidspyrnaPage): VidspyrnaPage => ({
  title: fields.title,
  slug: fields.slug,
  description: fields.description,
  longDescription: fields.longDescription ?? '',
  content: (fields.content && JSON.stringify(fields.content)) ?? null,
  link: fields.link ?? '',
  linkButtonText: fields.linkButtonText ?? '',
  tags: fields.tags.map(mapVidspyrnaTag),
  processEntry: fields.processEntry?.fields,
})

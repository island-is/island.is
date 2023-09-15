import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'

import { IOneColumnText } from '../generated/contentfulTypes'

import { Link, mapLink } from './link.model'
import { mapDocument, SliceUnion } from '../unions/slice.union'

@ObjectType()
export class OneColumnText {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @CacheField(() => Link, { nullable: true })
  link?: Link | null

  @CacheField(() => [SliceUnion], { nullable: true })
  content?: Array<typeof SliceUnion>

  @Field(() => Boolean, { nullable: true })
  dividerOnTop?: boolean

  @Field(() => Boolean, { nullable: true })
  showTitle?: boolean
}

export const mapOneColumnText = ({
  sys,
  fields,
}: IOneColumnText): SystemMetadata<OneColumnText> => ({
  typename: 'OneColumnText',
  id: sys.id,
  title: fields.title ?? '',
  link: fields.link ? mapLink(fields.link) : null,
  content: fields.content
    ? mapDocument(fields.content, sys.id + ':content')
    : [],
  dividerOnTop: fields.dividerOnTop ?? true,
  showTitle: fields.showTitle ?? true,
})

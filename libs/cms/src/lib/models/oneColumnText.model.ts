import { Field, ID, ObjectType } from '@nestjs/graphql'
import { SystemMetadata } from 'api-cms-domain'

import { IOneColumnText } from '../generated/contentfulTypes'
import { mapDocument, SliceUnion } from '../unions/slice.union'

import { Link, mapLink } from './link.model'

@ObjectType()
export class OneColumnText {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field(() => Link, { nullable: true })
  link?: Link | null

  @Field(() => [SliceUnion], { nullable: true })
  content?: Array<typeof SliceUnion>
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
})

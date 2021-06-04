import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IOneColumnText } from '../generated/contentfulTypes'

import { Link, mapLink } from './link.model'
import { SystemMetadata } from 'api-cms-domain'
import { mapDocument, SliceUnion } from '../unions/slice.union'

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

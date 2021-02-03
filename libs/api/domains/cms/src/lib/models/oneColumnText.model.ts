import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IOneColumnText } from '../generated/contentfulTypes'

import { Link, mapLink } from './link.model'
import { SystemMetadata } from 'api-cms-domain'

@ObjectType()
export class OneColumnText {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field({ nullable: true })
  content?: string

  @Field(() => Link, { nullable: true })
  link?: Link
}

export const mapOneColumnText = ({
  sys,
  fields,
}: IOneColumnText): SystemMetadata<OneColumnText> => ({
  typename: 'OneColumnText',
  id: sys.id,
  title: fields.title ?? '',
  content: fields.content ?? '',
  link: fields.link ? mapLink(fields.link) : null,
})

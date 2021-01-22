import {Field, ID, ObjectType} from '@nestjs/graphql'

import { ISingleColumnText } from '../generated/contentfulTypes'

import {Link, mapLink} from './link.model'
import {SystemMetadata} from "api-cms-domain";

@ObjectType()
export class SingleColumnText {
  @Field(() => ID)
  id: string

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  content?: string

  @Field(() => Link, { nullable: true })
  link?: Link
}

export const mapSingleColumnText = ({
  sys, fields,
}: ISingleColumnText): SystemMetadata<SingleColumnText> => ({
  typename: 'SingleColumnText',
  id: sys.id,
  title: fields.title ?? '',
  content: fields.content ?? '',
  link: fields.link ? mapLink(fields.link) : null
})

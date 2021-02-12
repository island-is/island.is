import { Field, ID, ObjectType } from '@nestjs/graphql'

import { ITwoColumnText } from '../generated/contentfulTypes'

import { Link, mapLink } from './link.model'
import { SystemMetadata } from 'api-cms-domain'

@ObjectType()
export class TwoColumnText {
  @Field(() => ID)
  id: string

  @Field({ nullable: true })
  rightTitle?: string

  @Field({ nullable: true })
  rightContent?: string

  @Field(() => Link, { nullable: true })
  rightLink?: Link

  @Field({ nullable: true })
  leftTitle?: string

  @Field({ nullable: true })
  leftContent?: string

  @Field(() => Link, { nullable: true })
  leftLink?: Link
}

export const mapTwoColumnText = ({
  sys,
  fields,
}: ITwoColumnText): SystemMetadata<TwoColumnText> => ({
  typename: 'TwoColumnText',
  id: sys.id,
  rightTitle: fields.rightTitle ?? '',
  rightContent: fields.rightContent ?? '',
  rightLink: fields.rightLink ? mapLink(fields.rightLink) : null,
  leftTitle: fields.leftTitle ?? '',
  leftContent: fields.leftContent ?? '',
  leftLink: fields.leftLink ? mapLink(fields.leftLink) : null,
})

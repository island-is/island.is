import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'

import { ITwoColumnText } from '../generated/contentfulTypes'

import { Link, mapLink } from './link.model'
import { SystemMetadata } from 'api-cms-domain'
import { mapDocument, SliceUnion } from '../unions/slice.union'

@ObjectType()
export class TwoColumnText {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  rightTitle?: string

  @CacheField(() => [SliceUnion], { nullable: true })
  rightContent?: Array<typeof SliceUnion>

  @CacheField(() => Link, { nullable: true })
  rightLink?: Link | null

  @Field({ nullable: true })
  leftTitle?: string

  @CacheField(() => [SliceUnion], { nullable: true })
  leftContent?: Array<typeof SliceUnion>

  @CacheField(() => Link, { nullable: true })
  leftLink?: Link | null

  @Field(() => Boolean, { nullable: true })
  dividerOnTop?: boolean
}

export const mapTwoColumnText = ({
  sys,
  fields,
}: ITwoColumnText): SystemMetadata<TwoColumnText> => ({
  typename: 'TwoColumnText',
  id: sys.id,
  rightTitle: fields.rightTitle ?? '',
  rightContent: fields.rightContent
    ? mapDocument(fields.rightContent, sys.id + ':right-content')
    : [],
  rightLink: fields.rightLink ? mapLink(fields.rightLink) : null,
  leftTitle: fields.leftTitle ?? '',
  leftContent: fields.leftContent
    ? mapDocument(fields.leftContent, sys.id + ':left-content')
    : [],
  leftLink: fields.leftLink ? mapLink(fields.leftLink) : null,
  dividerOnTop: fields.dividerOnTop ?? true,
})

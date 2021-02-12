import { Field, ID, ObjectType } from '@nestjs/graphql'

import { ITwoColumnText } from '../generated/contentfulTypes'

import { Link, mapLink } from './link.model'
import { SystemMetadata } from 'api-cms-domain'
import { mapDocument, SliceUnion } from '../unions/slice.union'

@ObjectType()
export class TwoColumnText {
  @Field(() => ID)
  id: string

  @Field({ nullable: true })
  rightTitle?: string

  @Field({ nullable: true })
  rightContent?: string

  @Field(() => [SliceUnion], { nullable: true })
  rightContentTest: Array<typeof SliceUnion>

  @Field(() => Link, { nullable: true })
  rightLink?: Link

  @Field({ nullable: true })
  leftTitle?: string

  @Field({ nullable: true })
  leftContent?: string

  @Field(() => [SliceUnion], { nullable: true })
  leftContentTest: Array<typeof SliceUnion>

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
  rightContentTest: fields.rightContentTest
    ? mapDocument(fields.rightContentTest, sys.id + ':right-content')
    : [],
  rightLink: fields.rightLink ? mapLink(fields.rightLink) : null,
  leftTitle: fields.leftTitle ?? '',
  leftContent: fields.leftContent ?? '',
  leftContentTest: fields.leftContentTest
    ? mapDocument(fields.leftContentTest, sys.id + ':left-content')
    : [],
  leftLink: fields.leftLink ? mapLink(fields.leftLink) : null,
})

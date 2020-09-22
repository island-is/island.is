import { Field, ID, ObjectType } from '@nestjs/graphql'

import { ISectionHeading } from '../generated/contentfulTypes'

@ObjectType()
export class HeadingSlice {
  @Field()
  typename: string

  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  body: string
}

export const mapHeadingSlice = ({
  fields,
  sys,
}: ISectionHeading): HeadingSlice => ({
  typename: 'HeadingSlice',
  id: sys.id,
  title: fields.title ?? '',
  body: fields.body ?? '',
})

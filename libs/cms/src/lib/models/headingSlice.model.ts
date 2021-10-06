import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ISectionHeading } from '../generated/contentfulTypes'
import { SystemMetadata } from '@island.is/shared/types'

@ObjectType()
export class HeadingSlice {
  @Field(() => ID)
  id!: string

  @Field()
  title?: string

  @Field()
  body?: string
}

export const mapHeadingSlice = ({
  fields,
  sys,
}: ISectionHeading): SystemMetadata<HeadingSlice> => ({
  typename: 'HeadingSlice',
  id: sys.id,
  title: fields.title ?? '',
  body: fields.body ?? '',
})

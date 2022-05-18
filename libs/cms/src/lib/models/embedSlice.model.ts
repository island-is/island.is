import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { IEmbedSlice } from '../generated/contentfulTypes'
import { SystemMetadata } from '@island.is/shared/types'

@ObjectType()
export class EmbedSlice {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  url!: string

  @Field(() => Int, { nullable: true })
  frameHeight?: number
}

export const mapEmbedSlice = ({
  fields,
  sys,
}: IEmbedSlice): SystemMetadata<EmbedSlice> => ({
  typename: 'EmbedSlice',
  id: sys.id,
  title: fields.title ?? '',
  url: fields.url ?? '',
  frameHeight: fields.frameHeight,
})

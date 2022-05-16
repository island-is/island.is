import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
// import { IEmbedSlice } from '../generated/contentfulTypes'
import { SystemMetadata } from '@island.is/shared/types'

@ObjectType()
export class EmbedSlice {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  url!: string

  @Field(() => Int)
  height!: number
}

export const mapEmbedSlice = ({
  fields,
  sys,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: Record<string, any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sys: Record<string, any>
}): SystemMetadata<EmbedSlice> => ({
  typename: 'EmbedSlice',
  id: sys.id,
  title: fields.title ?? '',
  url: fields.url ?? '',
  height: fields.height ?? 300,
})

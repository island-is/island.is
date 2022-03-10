import { Field, Int, ObjectType, ID } from '@nestjs/graphql'
import { Asset } from 'contentful'
import { SystemMetadata } from '@island.is/shared/types'

@ObjectType()
export class Image {
  @Field(() => ID)
  id?: string

  @Field()
  url?: string

  @Field()
  title?: string

  @Field()
  contentType?: string

  @Field(() => Int)
  width?: number

  @Field(() => Int)
  height?: number
}

export const mapImage = (entry: Asset): SystemMetadata<Image> => {
  const fields = entry?.fields
  const sys = entry?.sys
  return {
    typename: 'Image',
    id: sys?.id ?? '',
    url: fields?.file?.url ?? '',
    title: fields?.title ?? '',
    contentType: fields?.file?.contentType ?? '',
    width: fields?.file?.details?.image?.width ?? 0,
    height: fields?.file?.details?.image?.height ?? 0,
  }
}

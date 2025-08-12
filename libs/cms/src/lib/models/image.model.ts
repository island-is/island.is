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

  @Field(() => String, { nullable: true })
  description?: string

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

  // The url might not contain a protocol that's why we prepend https:
  // https://www.contentful.com/developers/docs/concepts/images/
  let url: string
  if (fields?.file?.url) {
    url = fields.file.url.startsWith('//')
      ? `https:${fields.file.url}`
      : fields.file.url
  } else {
    url = ''
  }

  return {
    typename: 'Image',
    id: sys?.id ?? '',
    url: url,
    title: fields?.title ?? '',
    description: fields?.description?.trim() ?? '',
    contentType: fields?.file?.contentType ?? '',
    width: fields?.file?.details?.image?.width ?? 0,
    height: fields?.file?.details?.image?.height ?? 0,
  }
}

import { Field, ObjectType, ID } from '@nestjs/graphql'
import { Asset as ContentfulAsset } from 'contentful'

@ObjectType()
export class Asset {
  @Field()
  typename!: string

  @Field(() => ID)
  id!: string

  @Field()
  url?: string

  @Field()
  title?: string

  @Field()
  contentType?: string
}

export const mapAsset = ({ sys, fields }: ContentfulAsset): Asset => {
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
    typename: 'Asset',
    id: sys.id,
    title: fields.title ?? '',
    url: url,
    contentType: fields.file?.contentType ?? '',
  }
}

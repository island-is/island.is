import { Field, Int, ObjectType, ID } from '@nestjs/graphql'
import { Asset as ContentfulAsset } from 'contentful'

@ObjectType()
export class Asset {
  constructor(initializer: Asset) {
    Object.assign(this, initializer)
  }

  @Field(() => ID)
  id: string

  @Field()
  url: string

  @Field()
  title: string

  @Field()
  contentType: string
}

export const mapAsset = ({ sys, fields }: ContentfulAsset): Asset =>
  new Asset({
    id: sys.id,
    title: fields.title ?? '',
    url: fields.file?.url ?? '',
    contentType: fields.file?.contentType ?? '',
  })

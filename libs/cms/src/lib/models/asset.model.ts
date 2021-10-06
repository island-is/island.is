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

export const mapAsset = ({ sys, fields }: ContentfulAsset): Asset => ({
  typename: 'Asset',
  id: sys.id,
  title: fields.title ?? '',
  url: fields.file?.url ?? '',
  contentType: fields.file?.contentType ?? '',
})

import { Field, Int, ObjectType, ID } from '@nestjs/graphql'
import { Asset } from 'contentful'

@ObjectType()
export class Image {
  constructor(initializer: Image) {
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

  @Field(() => Int)
  width: number

  @Field(() => Int)
  height: number
}

export const mapImage = ({ fields, sys }: Asset): Image => new Image({
  id: sys?.id ?? '',
  url: fields?.file?.url ?? '',
  title: fields?.title ?? '',
  contentType: fields?.file?.contentType ?? '',
  width: fields?.file?.details?.image?.width ?? 0,
  height: fields?.file?.details?.image?.height ?? 0,
})

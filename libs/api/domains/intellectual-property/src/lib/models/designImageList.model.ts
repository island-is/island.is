import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Image } from './getDesignImage.model'

@ObjectType('IntellectualPropertyDesignImageList')
export class ImageList {
  @Field(() => Int)
  count!: number

  @Field(() => [Image])
  images!: Array<Image> | null
}

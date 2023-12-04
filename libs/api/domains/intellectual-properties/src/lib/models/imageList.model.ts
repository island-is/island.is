import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Image } from './image.model'

@ObjectType('IntellectualPropertiesImageList')
export class ImageList {
  @Field(() => Int)
  count!: number

  @Field(() => [Image])
  images!: Array<Image> | null
}

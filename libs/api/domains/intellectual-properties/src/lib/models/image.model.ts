import { ObjectType, Field, Int } from '@nestjs/graphql'

@ObjectType('IntellectualPropertiesImage')
export class Image {
  @Field(() => Int, { nullable: true })
  designNumber?: number

  @Field(() => Int, { nullable: true })
  imageNumber?: number

  @Field(() => String, { nullable: true })
  image?: string
}

import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Image } from '../image.model'
import { AdgerdirPage } from '../adgerdirPage.model'

@ObjectType()
export class AdgerdirGroupSlice {
  constructor(initializer: AdgerdirGroupSlice) {
    Object.assign(this, initializer)
  }

  @Field(() => ID)
  id: string

  @Field({ nullable: true })
  subtitle?: string

  @Field()
  title: string

  @Field({ nullable: true })
  description?: string

  @Field(() => Image, { nullable: true })
  image?: Image

  @Field(() => [AdgerdirPage])
  pages: AdgerdirPage[]
}

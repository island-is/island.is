import { Field, ID, ObjectType } from '@nestjs/graphql'
import { AdgerdirNews } from '../adgerdirNews.model'

@ObjectType()
export class AdgerdirFeaturedNewsSlice {
  constructor(initializer: AdgerdirFeaturedNewsSlice) {
    Object.assign(this, initializer)
  }

  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field(() => [AdgerdirNews])
  featured: AdgerdirNews[]
}

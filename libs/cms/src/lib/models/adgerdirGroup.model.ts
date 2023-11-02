import { Field, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { AdgerdirPage } from './adgerdirPage.model'
import { Image } from './image.model'

@ObjectType()
export class AdgerdirGroup {
  @Field()
  id!: string

  @Field({ nullable: true })
  subtitle?: string

  @Field()
  title!: string

  @Field({ nullable: true })
  description!: string

  @CacheField(() => Image, { nullable: true })
  image?: Image

  @CacheField(() => [AdgerdirPage])
  pages!: AdgerdirPage[]
}

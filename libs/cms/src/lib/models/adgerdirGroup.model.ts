import { Field, ObjectType } from '@nestjs/graphql'
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

  @Field(() => Image, { nullable: true })
  image?: Image

  @Field(() => [AdgerdirPage])
  pages!: AdgerdirPage[]
}

import { Field, ObjectType } from '@nestjs/graphql'
import { AdgerdirPage } from './adgerdirPage.model'
import { Image } from './image.model'

@ObjectType()
export class AdgerdirNews {
  @Field()
  id: string

  @Field()
  slug: string

  @Field()
  subtitle: string

  @Field()
  title: string

  @Field()
  intro: string

  @Field(() => Image, { nullable: true })
  image?: Image

  @Field()
  date: string

  @Field({ nullable: true })
  content?: string

  @Field(() => [AdgerdirPage], { nullable: true })
  pages?: AdgerdirPage[]
}

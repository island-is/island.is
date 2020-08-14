import { Field, ObjectType } from '@nestjs/graphql'
import { Image } from './image.model'
import { Link } from './link.model'
import { LinkList } from './linkList.model'

@ObjectType()
export class LandingPage {
  @Field()
  title: string

  @Field()
  slug: string

  @Field()
  introduction: string

  @Field({ nullable: true })
  image: Image

  @Field({ nullable: true })
  actionButton: Link

  @Field({ nullable: true })
  links: LinkList

  @Field({ nullable: true })
  content: string
}

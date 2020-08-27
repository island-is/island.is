import { Field, ObjectType } from '@nestjs/graphql'
import { AdgerdirTag } from './adgerdirTag.model'

@ObjectType()
export class AdgerdirPage {
  @Field()
  id: string

  @Field()
  slug: string

  @Field()
  title: string

  @Field({ nullable: true })
  description?: string

  @Field({ nullable: true })
  content?: string

  @Field(() => [AdgerdirTag])
  tags: AdgerdirTag[]

  @Field({ nullable: true })
  link?: string

  @Field()
  status: string
}

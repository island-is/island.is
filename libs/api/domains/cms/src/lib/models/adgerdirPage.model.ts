import { Field, ObjectType } from '@nestjs/graphql'
import { AdgerdirTag } from './adgerdirTag.model'

@ObjectType()
export class AdgerdirPage {
  @Field()
  id: string

  @Field()
  title: string

  @Field()
  description: string

  @Field({ nullable: true })
  longDescription?: string

  @Field({ nullable: true })
  content?: string

  @Field({ nullable: true })
  objective?: string

  @Field()
  slug: string

  @Field(() => [AdgerdirTag])
  tags: AdgerdirTag[]

  @Field({ nullable: true })
  link?: string

  @Field({ nullable: true })
  linkButtonText?: string

  @Field()
  status: string

  @Field({ nullable: true })
  estimatedCostIsk?: number

  @Field({ nullable: true })
  finalCostIsk?: number
}

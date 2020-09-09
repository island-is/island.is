import { Field, ObjectType, ID } from '@nestjs/graphql'
import { AdgerdirTag, mapAdgerdirTag } from './adgerdirTag.model'
import { IVidspyrnaPage } from '../generated/contentfulTypes'

@ObjectType()
export class AdgerdirPage {
  @Field(() => ID)
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

export const mapAdgerdirPage = ({
  sys,
  fields,
}: IVidspyrnaPage): AdgerdirPage => ({
  id: sys.id,
  slug: fields.slug,
  title: fields.title,
  description: fields.description,
  tags: fields.tags.map(mapAdgerdirTag),
  status: fields.status,
  content: JSON.stringify(fields.content),
})

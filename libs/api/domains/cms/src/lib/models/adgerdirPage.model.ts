import { Field, ObjectType, ID } from '@nestjs/graphql'
import { AdgerdirTag, mapAdgerdirTag } from './adgerdirTag.model'
import { IVidspyrnaPage } from '../generated/contentfulTypes'

@ObjectType()
export class AdgerdirPage {
  @Field(() => ID)
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

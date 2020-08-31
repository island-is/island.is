import { Field, ObjectType, ID } from '@nestjs/graphql'
import { IVidspyrnaFrontpage } from '../generated/contentfulTypes'

@ObjectType()
export class AdgerdirFrontpage {
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
}

export const mapAdgerdirFrontpage = ({
  sys,
  fields,
}: IVidspyrnaFrontpage): AdgerdirFrontpage => ({
  id: sys.id,
  slug: fields.slug,
  title: fields.title,
  description: fields.description,
  content: fields.content && JSON.stringify(fields.content),
})

import { Field, ObjectType, ID } from '@nestjs/graphql'
import { IGenericTag } from '../generated/contentfulTypes'

@ObjectType()
export class GenericTag {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  slug!: string
}

export const mapGenericTag = ({ sys, fields }: IGenericTag): GenericTag => ({
  id: sys.id,
  title: fields.title ?? '',
  slug: fields.slug ?? '',
})

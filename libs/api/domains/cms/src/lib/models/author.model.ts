import { Field, ObjectType, ID } from '@nestjs/graphql'

import { IAuthor } from '../generated/contentfulTypes'

@ObjectType()
export class Author {
  @Field(() => ID)
  id: string

  @Field()
  name: string
}

export const mapAuthor = ({ sys, fields }: IAuthor): Author => ({
  id: sys.id,
  name: fields.name ?? '',
})

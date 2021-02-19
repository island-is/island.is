import { Field, ObjectType } from '@nestjs/graphql'

import { ICard } from '../generated/contentfulTypes'

@ObjectType()
export class Card {
  @Field()
  title: string

  @Field()
  body: string

  @Field({ nullable: true })
  linkText?: string

  @Field({ nullable: true })
  link?: string
}

export const mapCard = ({ fields }: ICard): Card => ({
  title: fields.title,
  body: fields.body,
  linkText: fields.linkText ?? '',
  link: fields.link ?? '',
})

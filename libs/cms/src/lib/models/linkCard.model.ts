import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ICard } from '../generated/contentfulTypes'

@ObjectType()
export class LinkCard {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  body!: string

  @Field()
  link?: string

  @Field()
  linkText?: string
}

export const mapLinkCard = ({ sys, fields }: ICard): LinkCard => ({
  id: sys.id,
  title: fields?.title ?? '',
  body: fields?.body ?? '',
  link: fields?.link ?? '',
  linkText: fields?.linkText ?? '',
})

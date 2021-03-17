import { Field, ObjectType } from '@nestjs/graphql'
import { ICard } from '../generated/contentfulTypes'

@ObjectType()
export class LinkCard {
  @Field()
  title!: string

  @Field()
  body!: string

  @Field()
  link?: string

  @Field()
  linkText?: string
}

export const mapLinkCard = ({ fields }: ICard): LinkCard => ({
  title: fields?.title ?? '',
  body: fields?.body ?? '',
  link: fields?.link ?? '',
  linkText: fields?.linkText ?? '',
})

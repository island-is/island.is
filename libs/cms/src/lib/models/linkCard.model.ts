import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ICard } from '../generated/contentfulTypes'
import { SystemMetadata } from '@island.is/shared/types'

@ObjectType()
export class LinkCard {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  body!: string

  @Field()
  linkUrl!: string

  @Field({ nullable: true })
  linkText?: string
}

export const mapLinkCard = ({
  sys,
  fields,
}: ICard): SystemMetadata<LinkCard> => ({
  typename: 'LinkCard',
  id: sys.id,
  title: fields?.title ?? '',
  body: fields?.body ?? '',
  linkUrl: fields?.linkUrl,
  linkText: fields?.linkText ?? '',
})

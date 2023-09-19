import { Field, ID, ObjectType } from '@nestjs/graphql'
import { SystemMetadata } from '@island.is/shared/types'
import { IEmbed } from '../generated/contentfulTypes'

@ObjectType()
export class Embed {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field({ nullable: true })
  embedUrl?: string

  @Field({ nullable: true })
  altText?: string

  @Field({ nullable: true })
  aspectRatio?: string
}

export const mapEmbed = ({ fields, sys }: IEmbed): SystemMetadata<Embed> => ({
  typename: 'Embed',
  id: sys.id,
  title: fields.title ?? '',
  embedUrl: fields.embedUrl,
  altText: fields.altText,
  aspectRatio: fields.aspectRatio,
})

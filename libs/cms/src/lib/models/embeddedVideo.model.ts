import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IEmbeddedVideo } from '../generated/contentfulTypes'
import { SystemMetadata } from '@island.is/shared/types'

@ObjectType()
export class EmbeddedVideo {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  url!: string

  @Field(() => String, { nullable: true })
  thumbnailImageUrl?: string
}

export const mapEmbeddedVideo = ({
  fields,
  sys,
}: IEmbeddedVideo): SystemMetadata<EmbeddedVideo> => ({
  typename: 'EmbeddedVideo',
  id: sys.id,
  title: fields.title ?? '',
  url: fields.url ?? '',
  thumbnailImageUrl: fields.thumbnailImage?.fields?.file?.url ?? '',
})

import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'
import { IEvent } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { Organization, mapOrganization } from './organization.model'
import { SliceUnion, mapDocument } from '../unions/slice.union'
import { EmbeddedVideo, mapEmbeddedVideo } from './embeddedVideo.model'
import GraphQLJSON from 'graphql-type-json'

@ObjectType()
export class Event {
  @Field(() => ID)
  id!: string

  @CacheField(() => Organization, { nullable: true })
  organization?: Organization | null

  @Field(() => String)
  title!: string

  @Field(() => String)
  slug!: string

  @Field(() => String)
  date!: string

  @Field(() => GraphQLJSON)
  time!: { startTime: string; endTime: string }

  @Field(() => GraphQLJSON)
  location!: { streetAddress: string; floor: string; postalCode: string }

  @CacheField(() => [SliceUnion], { nullable: true })
  content: Array<typeof SliceUnion> = []

  @CacheField(() => EmbeddedVideo, { nullable: true })
  video?: EmbeddedVideo | null

  @CacheField(() => Image, { nullable: true })
  image!: Image | null

  @Field(() => Boolean, { nullable: true })
  fullWidthImageInContent?: boolean

  @CacheField(() => Image, { nullable: true })
  featuredImage?: Image | null
}

export const mapEvent = ({ sys, fields }: IEvent): SystemMetadata<Event> => ({
  typename: 'Event',
  id: sys.id,
  title: fields.title ?? '',
  date: fields.startDate ?? '',
  time: (fields.time as Event['time']) ?? { startTime: '', endTime: '' },
  location: (fields.location as Event['location']) ?? {
    streetAddress: '',
    floor: '',
    postalCode: '',
  },

  content: fields.content
    ? mapDocument(fields.content, sys.id + ':content')
    : [],
  video: fields.video ? mapEmbeddedVideo(fields.video) : null,
  image: fields.image ? mapImage(fields.image) : null,
  slug: fields.slug ?? '',
  featuredImage: fields.featuredImage ? mapImage(fields.featuredImage) : null,
  fullWidthImageInContent: fields.fullWidthImageInContent ?? true,
  organization: fields.organization
    ? mapOrganization(fields.organization)
    : null,
})

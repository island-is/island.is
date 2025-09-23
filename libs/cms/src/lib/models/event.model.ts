import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'
import { IEvent } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { Organization, mapOrganization } from './organization.model'
import { SliceUnion, mapDocument } from '../unions/slice.union'
import { EmbeddedVideo, mapEmbeddedVideo } from './embeddedVideo.model'

@ObjectType()
class EventLocation {
  @Field(() => String, { nullable: true })
  streetAddress?: string | null

  @Field(() => String, { nullable: true })
  floor?: string | null

  @Field(() => String, { nullable: true })
  postalCode?: string | null

  @Field(() => Boolean, { nullable: true })
  useFreeText?: boolean

  @Field(() => String, { nullable: true })
  freeText?: string
}

@ObjectType()
class EventTime {
  @Field(() => String, { nullable: true })
  startTime?: string | null

  @Field(() => String, { nullable: true })
  endTime?: string | null

  @Field(() => String, { nullable: true })
  endDate?: string | null
}

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
  startDate!: string

  @Field(() => String)
  endDate!: string

  @CacheField(() => EventTime)
  time!: EventTime

  @CacheField(() => EventLocation)
  location!: EventLocation

  @CacheField(() => [SliceUnion], { nullable: true })
  content: Array<typeof SliceUnion> = []

  @CacheField(() => EmbeddedVideo, { nullable: true })
  video?: EmbeddedVideo | null

  @CacheField(() => Image, { nullable: true })
  thumbnailImage?: Image | null

  @CacheField(() => Image, { nullable: true })
  contentImage?: Image | null

  @Field(() => Boolean, { nullable: true })
  fullWidthImageInContent?: boolean

  @CacheField(() => Image, { nullable: true })
  featuredImage?: Image | null

  @Field(() => String, { nullable: true })
  firstPublishedAt?: string | null
}

export const mapEvent = ({ sys, fields }: IEvent): SystemMetadata<Event> => {
  let endDate = ''

  if (fields.time?.endDate) {
    const date = new Date(fields.time.endDate)
    if (fields.time.endTime) {
      const [hours, minutes] = fields.time.endTime.split(':')
      date.setHours(Number(hours))
      date.setMinutes(Number(minutes))
    }
    endDate = date.getTime().toString()
  } else if (fields.startDate && fields.time?.endTime) {
    const date = new Date(fields.startDate)
    const [hours, minutes] = fields.time.endTime.split(':')
    date.setHours(Number(hours))
    date.setMinutes(Number(minutes))
    endDate = date.getTime().toString()
  }

  return {
    typename: 'Event',
    id: sys.id,
    title: fields.title ?? '',
    startDate: fields.startDate ?? '',
    endDate,
    time: (fields.time as Event['time']) ?? {
      startTime: '',
      endTime: '',
      endDate: '',
    },
    location: (fields.location as Event['location']) ?? {
      streetAddress: '',
      floor: '',
      postalCode: '',
      freeText: '',
      useFreeText: false,
    },
    content: fields.content
      ? mapDocument(fields.content, sys.id + ':content')
      : [],
    video: fields.video ? mapEmbeddedVideo(fields.video) : null,
    thumbnailImage: fields.thumbnailImage
      ? mapImage(fields.thumbnailImage)
      : null,
    contentImage: fields.contentImage ? mapImage(fields.contentImage) : null,
    slug: fields.slug ?? '',
    featuredImage: fields.featuredImage ? mapImage(fields.featuredImage) : null,
    fullWidthImageInContent: fields.fullWidthImageInContent ?? true,
    organization: fields.organization
      ? mapOrganization(fields.organization)
      : null,
    firstPublishedAt: (sys as unknown as { firstPublishedAt: string })
      .firstPublishedAt,
  }
}

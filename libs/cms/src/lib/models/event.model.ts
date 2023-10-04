import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'
import { IEvent } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { Organization, mapOrganization } from './organization.model'
import { SliceUnion, mapDocument } from '../unions/slice.union'

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

  @Field(() => String, { nullable: true })
  intro!: string

  @CacheField(() => Image, { nullable: true })
  image!: Image | null

  @Field(() => Boolean, { nullable: true })
  fullWidthImageInContent?: boolean

  @CacheField(() => [SliceUnion], { nullable: true })
  content: Array<typeof SliceUnion> = []

  @CacheField(() => Image, { nullable: true })
  featuredImage?: Image | null
}

export const mapEvent = ({ sys, fields }: IEvent): SystemMetadata<Event> => ({
  typename: 'Event',
  id: sys.id,
  title: fields.title ?? '',
  date: fields.startDate ?? '',
  content: fields.content
    ? mapDocument(fields.content, sys.id + ':content')
    : [],
  image: fields.image ? mapImage(fields.image) : null,
  slug: fields.slug ?? '',
  featuredImage: fields.featuredImage ? mapImage(fields.featuredImage) : null,
  fullWidthImageInContent: fields.fullWidthImageInContent ?? true,
  intro: fields.introduction ?? '',
  organization: fields.organization
    ? mapOrganization(fields.organization)
    : null,
})

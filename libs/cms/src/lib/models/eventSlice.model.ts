import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'

import { IEventSlice } from '../generated/contentfulTypes'

import { Link, mapLink } from './link.model'
import { Image, mapImage } from './image.model'

@ObjectType()
export class EventSlice {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  subtitle!: string

  @Field()
  date!: string

  @CacheField(() => Link, { nullable: true })
  link!: Link | null

  @CacheField(() => Image, { nullable: true })
  backgroundImage!: Image | null
}

export const mapEventSlice = ({
  sys,
  fields,
}: IEventSlice): SystemMetadata<EventSlice> => ({
  typename: 'EventSlice',
  id: sys.id,
  title: fields.title ?? '',
  subtitle: fields.subtitle ?? '',
  date: fields.date ?? '',
  link: fields.link ? mapLink(fields.link) : null,
  backgroundImage: fields.backgroundImage
    ? mapImage(fields.backgroundImage)
    : null,
})

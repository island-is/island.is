import { Field, ObjectType, ID } from '@nestjs/graphql'

import { ILocation } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { Link, mapLink } from './link.model'

@ObjectType()
export class Location {
  @Field()
  typename: string

  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  subTitle: string

  @Field()
  address: string

  @Field(() => Link, { nullable: true })
  link: Link

  @Field(() => Image)
  background: Image
}

export const mapLocation = ({ fields, sys }: ILocation): Location => ({
  typename: 'Location',
  id: sys.id,
  title: fields.title ?? '',
  subTitle: fields.subTitle ?? '',
  address: fields.address ?? '',
  link: fields.link && mapLink(fields.link),
  background: mapImage(fields.background),
})

import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IDistricts } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { Link, mapLink } from './link.model'
import { SystemMetadata } from 'api-cms-domain'

@ObjectType()
export class Districts {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  description: string

  @Field({ nullable: true })
  image?: Image
}

export const mapDistricts = ({
  sys,
  fields,
}: IDistricts): SystemMetadata<Districts> => ({
  typename: 'Districts',
  id: sys.id,
  title: fields.title,
  description: fields.description,
  image: mapImage(fields.image),
})

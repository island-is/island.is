import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IDistricts } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { Link, mapLink } from './link.model'
import { SystemMetadata } from 'api-cms-domain'

@ObjectType()
export class Districts {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field({ nullable: true })
  description?: string

  @Field(() => Image, { nullable: true })
  image?: Image | null

  @Field(() => [Link])
  links?: Array<Link>
}

export const mapDistricts = ({
  sys,
  fields,
}: IDistricts): SystemMetadata<Districts> => ({
  typename: 'Districts',
  id: sys.id,
  title: fields.title ?? '',
  description: fields.description ?? '',
  image: fields.image ? mapImage(fields.image) : null,
  links: (fields.links ?? []).map(mapLink),
})

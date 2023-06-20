import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'

import { IDistricts } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { Link, mapLink } from './link.model'

@ObjectType()
export class Districts {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field({ nullable: true })
  description?: string

  @CacheField(() => Image, { nullable: true })
  image?: Image | null

  @CacheField(() => [Link])
  links?: Array<Link>

  @Field(() => Boolean, { nullable: true })
  hasBorderAbove?: boolean
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
  hasBorderAbove: fields.hasBorderAbove ?? true,
})

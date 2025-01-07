import { Field, ObjectType } from '@nestjs/graphql'
import { IFeaturedLinks } from '../generated/contentfulTypes'
import { Featured, mapFeatured } from './featured.model'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'

@ObjectType()
export class FeaturedLinks {
  @Field()
  title?: string

  @CacheField(() => [Featured], { nullable: true })
  featuredLinks?: Featured[] | null
}

export const mapFeaturedLinks = ({
  fields,
}: IFeaturedLinks): SystemMetadata<FeaturedLinks> => ({
  typename: 'FeaturedLinks',
  title: fields.displayedTitle ?? '',
  featuredLinks: fields.links ? fields.links.map(mapFeatured) : [],
})

import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IFeaturedLinks } from '../generated/contentfulTypes'
import { Featured, mapFeatured } from './featured.model'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'

@ObjectType()
export class FeaturedLinks {
  @Field(() => ID)
  id!: string

  @Field()
  title?: string

  @CacheField(() => [Featured], { nullable: true })
  featuredLinks?: Featured[] | null
}

export const mapFeaturedLinks = ({
  fields,
  sys,
}: IFeaturedLinks): SystemMetadata<FeaturedLinks> => ({
  typename: 'FeaturedLinks',
  id: sys.id,
  title: fields.displayedTitle ?? '',
  featuredLinks: fields.links ? fields.links.map(mapFeatured) : [],
})

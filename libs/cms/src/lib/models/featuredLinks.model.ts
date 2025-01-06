import { Field, ObjectType } from '@nestjs/graphql'
import { IFeaturedLinks } from '../generated/contentfulTypes'
import { Featured, mapFeatured } from './featured.model'
import { CacheField } from '@island.is/nest/graphql'

@ObjectType()
export class FeaturedLinks {
  @Field()
  title?: string

  @CacheField(() => [Featured], { nullable: true })
  links?: Featured[] | null
}

export const mapFeaturedLinks = ({
  fields,
}: IFeaturedLinks): FeaturedLinks => ({
  title: fields.displayedTitle ?? '',
  links: fields.links ? fields.links.map(mapFeatured) : [],
})

import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Link, mapLink } from './link.model'
import { mapSupportQNA, SupportQNA } from './supportQNA.model'
import { IFeaturedSupportQnAs } from '../generated/contentfulTypes'

@ObjectType()
export class FeaturedSupportQNAs {
  @Field(() => ID)
  id!: string

  @Field(() => Link, { nullable: true })
  link?: Link | null

  @Field(() => [SupportQNA], { nullable: true })
  supportQNAs?: SupportQNA[]
}

export const mapFeaturedSupportQNAs = ({
  sys,
  fields,
}: IFeaturedSupportQnAs) => ({
  typename: 'FeaturedSupportQNAs',
  id: sys.id,
  link: fields.link ? mapLink(fields.link) : null,
  supportQNAs: (fields.supportQNAs ?? []).map(mapSupportQNA),
})

import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'

import { IOverviewLinks } from '../generated/contentfulTypes'
import { Link, mapLink } from './link.model'
import { IntroLinkImage, mapIntroLinkImage } from './introLinkImage.model'

@ObjectType()
export class OverviewLinks {
  @Field(() => ID)
  id!: string

  @CacheField(() => [IntroLinkImage])
  overviewLinks!: Array<IntroLinkImage>

  @CacheField(() => Link, { nullable: true })
  link!: Link | null

  @Field(() => Boolean, { nullable: true })
  hasBorderAbove?: boolean
}

export const mapOverviewLinks = ({
  sys,
  fields,
}: IOverviewLinks): SystemMetadata<OverviewLinks> => ({
  typename: 'OverviewLinks',
  id: sys.id,
  overviewLinks: (fields.overviewLinks ?? []).map(mapIntroLinkImage),
  link: fields.link ? mapLink(fields.link) : null,
  hasBorderAbove: fields.hasBorderAbove ?? true,
})

import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'

import {
  IIntroLinkImage,
  IOneColumnText,
  IOverviewLinks,
} from '../generated/contentfulTypes'
import { Link, mapLink } from './link.model'
import { IntroLinkImage, mapIntroLinkImage } from './introLinkImage.model'
import { OneColumnText, mapOneColumnText } from './oneColumnText.model'

@ObjectType()
export class OverviewLinks {
  @Field(() => ID)
  id!: string

  @CacheField(() => [IntroLinkImage])
  overviewLinks!: Array<IntroLinkImage>

  @CacheField(() => [OneColumnText], { nullable: true })
  cardLinks?: Array<OneColumnText> | null

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
  overviewLinks: (fields.overviewLinks ?? [])
    .filter((link) => link.sys.contentType.sys.id === 'introLinkImage')
    .map((link) => mapIntroLinkImage(link as IIntroLinkImage)),
  cardLinks: (fields.overviewLinks ?? [])
    .filter((link) => link.sys.contentType.sys.id === 'oneColumnText')
    .map((link) => mapOneColumnText(link as IOneColumnText)),
  link: fields.link ? mapLink(fields.link) : null,
  hasBorderAbove: fields.hasBorderAbove ?? true,
})

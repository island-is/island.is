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
import { documentToPlainTextString } from '@contentful/rich-text-plain-text-renderer'

@ObjectType('OverviewLinksCardLink')
class CardLink extends OneColumnText {
  @Field({ nullable: true })
  contentString?: string
}

@ObjectType()
export class OverviewLinks {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  titleAbove?: string

  @CacheField(() => [IntroLinkImage])
  overviewLinks!: Array<IntroLinkImage>

  @CacheField(() => [CardLink], { nullable: true })
  cardLinks?: Array<CardLink> | null

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
  title: fields.displayedTitle ?? '',
  overviewLinks: (fields.overviewLinks ?? [])
    .filter((link) => link.sys.contentType.sys.id === 'introLinkImage')
    .map((link) => mapIntroLinkImage(link as IIntroLinkImage)),
  cardLinks: (fields.overviewLinks ?? [])
    .filter((link) => link.sys.contentType.sys.id === 'oneColumnText')
    .map((link) => {
      const oneColumnText = link as IOneColumnText
      return {
        ...mapOneColumnText(oneColumnText),
        contentString: oneColumnText.fields.content
          ? documentToPlainTextString(oneColumnText.fields.content)
          : '',
      }
    }),
  link: fields.link ? mapLink(fields.link) : null,
  hasBorderAbove: fields.hasBorderAbove ?? true,
})

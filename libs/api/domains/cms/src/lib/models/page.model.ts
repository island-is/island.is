import { Field, ObjectType } from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-express'

import {
  IPage,
  IBigBulletList,
  IMailingListSignup,
  ISectionHeading,
  ILatestNewsSlice,
  ICardSection,
  ILogoListSlice,
  IStorySection,
  ITabSection,
  ITimeline,
} from '../generated/contentfulTypes'

import { PageHeader } from './pageHeader.model'
import { BigBulletList, mapBigBulletList } from './bigBulletList.model'
import {
  MailingListSignup,
  mapMailingListSignup,
} from './mailingListSignup.model'
import { SectionHeading, mapSectionHeading } from './sectionHeading.model'
import { LatestNewsSlice, mapLatestNewsSlice } from './latestNewsSlice.model'
import { CardSection, mapCardSection } from './cardSection.model'
import { LogoListSlice, mapLogoListSlice } from './logoListSlice.model'
import { StorySection, mapStorySection } from './storySection.model'
import { TabSection, mapTabSection } from './tabSection.model'
import { Timeline, mapTimeline } from './timeline.model'

@ObjectType()
export class Page {
  @Field()
  contentStatus: string

  @Field()
  title: string

  @Field()
  slug: string

  @Field({ nullable: true })
  seoDescription?: string

  @Field({ nullable: true })
  theme?: string

  @Field(() => PageHeader)
  header: PageHeader

  @Field(() => [
    BigBulletList,
    MailingListSignup,
    SectionHeading,
    LatestNewsSlice,
    CardSection,
    LogoListSlice,
    StorySection,
    TabSection,
    Timeline,
  ])
  slices: Array<
    | BigBulletList
    | MailingListSignup
    | SectionHeading
    | LatestNewsSlice
    | CardSection
    | LogoListSlice
    | StorySection
    | TabSection
    | Timeline
  >
}

const mapSlice = (
  slice:
    | IBigBulletList
    | IMailingListSignup
    | ISectionHeading
    | ILatestNewsSlice
    | ICardSection
    | ILogoListSlice
    | IStorySection
    | ITabSection
    | ITimeline,
) => {
  switch (slice.sys.contentType.sys.id) {
    case 'bigBulletList':
      return mapBigBulletList(slice as IBigBulletList)
    case 'mailingListSignup':
      return mapMailingListSignup(slice as IMailingListSignup)
    case 'sectionHeading':
      return mapSectionHeading(slice as ISectionHeading)
    case 'latestNewsSlice':
      return mapLatestNewsSlice(slice as ILatestNewsSlice)
    case 'cardSection':
      return mapCardSection(slice as ICardSection)
    case 'logoListSlice':
      return mapLogoListSlice(slice as ILogoListSlice)
    case 'storySection':
      return mapStorySection(slice as IStorySection)
    case 'tabSection':
      return mapTabSection(slice as ITabSection)
    case 'timeline':
      return mapTimeline(slice as ITimeline)

    default:
      throw new ApolloError(
        `Cannot convert to slice: ${
          (slice.sys.contentType.sys as { id: string }).id
        }`,
      )
  }
}

export const mapPage = ({ fields }: IPage): Page => ({
  contentStatus: fields.contentStatus,
  title: fields.title,
  slug: fields.slug,
  seoDescription: fields.seoDescription ?? '',
  theme: fields.theme ?? '',
  header: fields.header?.fields,
  slices: fields.slices.map(mapSlice),
})

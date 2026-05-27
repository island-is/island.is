import { Field, ObjectType, ID } from '@nestjs/graphql'
import { IAnnualReport } from '../generated/contentfulTypes'
import { CacheField } from '@island.is/nest/graphql'
import {
  AnnualReportChapter,
  mapAnnualReportChapter,
} from './annualReportChapter.model'
import { TimelineSlice, mapTimelineSlice } from './timelineSlice.model'

@ObjectType()
export class AnnualReport {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  slug!: string

  @Field({ nullable: true })
  intro?: string

  @CacheField(() => [AnnualReportChapter])
  chapters!: Array<AnnualReportChapter>

  @CacheField(() => TimelineSlice, { nullable: true })
  timeline?: TimelineSlice
}

export const mapAnnualReport = ({
  fields,
  sys,
}: IAnnualReport): AnnualReport => ({
  id: sys.id,
  title: fields.title,
  slug: fields.slug,
  intro: fields.intro ?? '',
  chapters: fields.chapters.map(mapAnnualReportChapter),
  timeline: fields.timeline ? mapTimelineSlice(fields.timeline) : undefined,
})

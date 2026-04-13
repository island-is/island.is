import { Field, ObjectType, ID } from '@nestjs/graphql'
import { IAnnualReport } from '../generated/contentfulTypes'
import { CacheField } from '@island.is/nest/graphql'
import { OrganizationPage, mapOrganizationPage } from './organizationPage.model'
import { Organization, mapOrganization } from './organization.model'
import {
  AnnualReportChapter,
  mapAnnualReportChapter,
} from './annualReportChapter.model'

@ObjectType()
export class AnnualReport {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field({ nullable: true })
  intro?: string

  @Field()
  pageIdentifier!: string

  @CacheField(() => OrganizationPage)
  organizationPage!: OrganizationPage | null

  @CacheField(() => Organization)
  organization!: Organization | null

  @CacheField(() => [AnnualReportChapter])
  chapters!: Array<AnnualReportChapter>
}

export const mapAnnualReport = ({
  fields,
  sys,
}: IAnnualReport): AnnualReport => ({
  id: sys.id,
  title: fields.title,
  intro: fields.intro ?? '',
  pageIdentifier: fields.pageIdentifier,
  organizationPage: fields.organizationPage
    ? mapOrganizationPage(fields.organizationPage)
    : null,
  organization: fields.organization
    ? mapOrganization(fields.organization)
    : null,
  chapters: fields.chapters.map(mapAnnualReportChapter),
})

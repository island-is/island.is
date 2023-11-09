import { registerEnumType } from '@nestjs/graphql'

export enum SearchableContentTypes {
  webArticle = 'webArticle',
  webSubArticle = 'webSubArticle',
  webLifeEventPage = 'webLifeEventPage',
  webDigitalIcelandService = 'webDigitalIcelandService',
  webDigitalIcelandCommunityPage = 'webDigitalIcelandCommunityPage',
  webNews = 'webNews',
  webAdgerdirPage = 'webAdgerdirPage',
  webOrganizationSubpage = 'webOrganizationSubpage',
  webOrganizationPage = 'webOrganizationPage',
  webQNA = 'webQNA',
  webLink = 'webLink',
  webProjectPage = 'webProjectPage',
  webManual = 'webManual',
}

registerEnumType(SearchableContentTypes, { name: 'SearchableContentTypes' })

import { registerEnumType } from '@nestjs/graphql'

export enum SearchableContentTypes {
  webAboutPage = 'webAboutPage',
  webArticle = 'webArticle',
  webSubArticle = 'webSubArticle',
  webLifeEventPage = 'webLifeEventPage',
  webNews = 'webNews',
  webAdgerdirPage = 'webAdgerdirPage',
  webOrganizationSubpage = 'webOrganizationSubpage',
  webQNA = 'webQNA',
}

registerEnumType(SearchableContentTypes, { name: 'SearchableContentTypes' })

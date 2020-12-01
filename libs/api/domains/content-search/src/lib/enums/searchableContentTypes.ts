import { registerEnumType } from '@nestjs/graphql'

export enum SearchableContentTypes {
  webAboutPage = 'webAboutPage',
  webArticle = 'webArticle',
  webLifeEventPage = 'webLifeEventPage',
  webNews = 'webNews',
  webAdgerdirPage = 'webAdgerdirPage',
}

registerEnumType(SearchableContentTypes, { name: 'SearchableContentTypes' })

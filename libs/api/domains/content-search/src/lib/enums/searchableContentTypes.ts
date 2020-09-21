import { registerEnumType } from '@nestjs/graphql'

export enum SearchableContentTypes {
  webAboutPage = 'webAboutPage',
  webArticle = 'webArticle',
  webLifeEventPage = 'webLifeEventPage',
  webNews = 'webNews',
}

registerEnumType(SearchableContentTypes, { name: 'SearchableContentTypes' })

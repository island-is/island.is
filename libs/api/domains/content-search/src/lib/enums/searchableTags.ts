import { registerEnumType } from '@nestjs/graphql'

export enum SearchableTags {
  category = 'category',
  processentry = 'processentry',
  organization = 'organization',
}

registerEnumType(SearchableTags, { name: 'SearchableTags' })

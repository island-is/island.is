import { registerEnumType } from '@nestjs/graphql'

export enum SearchableTags {
  category = 'category',
  processentry = 'processentry',
}

registerEnumType(SearchableTags, { name: 'SearchableTags' })

import { registerEnumType } from '@nestjs/graphql'

export enum SearchableTags {
  category = 'category'
}

registerEnumType(SearchableTags, { name: 'SearchableTags' })

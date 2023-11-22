import { registerEnumType } from '@nestjs/graphql'

export enum SearchableTags {
  category = 'category',
  processentry = 'processentry',
  organization = 'organization',
  referencedBy = 'referencedBy',
}

registerEnumType(SearchableTags, { name: 'SearchableTags' })

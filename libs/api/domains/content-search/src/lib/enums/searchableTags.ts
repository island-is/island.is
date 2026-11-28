import { registerEnumType } from '@nestjs/graphql'

export enum SearchableTags {
  category = 'category',
  processentry = 'processentry',
  organization = 'organization',
  referencedBy = 'referencedBy',
  project = 'project',
}

registerEnumType(SearchableTags, { name: 'SearchableTags' })

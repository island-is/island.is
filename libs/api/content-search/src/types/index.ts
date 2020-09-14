export * from './document'

export type sortDirection = 'desc' | 'asc'

export type sortableFields = {
  dateUpdated?: sortDirection
  dateCreated?: sortDirection
}
export enum SearchIndexes {
  'is' = 'island-is',
  'en' = 'island-en',
}

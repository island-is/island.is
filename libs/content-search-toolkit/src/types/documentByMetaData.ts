import { elasticTagField, SortDirection } from './shared'

export type sortableFields = {
  dateUpdated?: SortDirection
  dateCreated?: SortDirection
  'title.sort'?: SortDirection
  popularityScore?: SortDirection
}

interface MetaPropsBase {
  types?: string[]
  tags?: elasticTagField[]
  date?: {
    from?: string
    to?: string
  }
  sort?: sortableFields
  page?: number
  size?: number
}

interface RequiredTypes extends MetaPropsBase {
  types: string[]
}

interface RequiredTags extends MetaPropsBase {
  tags: elasticTagField[]
}

export type DocumentByMetaDataInput = RequiredTypes | RequiredTags

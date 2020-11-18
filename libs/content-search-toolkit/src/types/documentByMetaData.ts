import { elasticTagField, sortDirection } from './index'

type sortableFields = {
  dateUpdated?: sortDirection
  dateCreated?: sortDirection
  'title.sort'?: sortDirection
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

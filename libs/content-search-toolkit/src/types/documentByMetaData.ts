import { elasticTagField, sortRule } from './shared'

interface MetaPropsBase {
  types?: string[]
  tags?: elasticTagField[]
  date?: {
    from?: string
    to?: string
  }
  releaseDate?: {
    from?: string
    to?: string
  }
  sort?: sortRule[]
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

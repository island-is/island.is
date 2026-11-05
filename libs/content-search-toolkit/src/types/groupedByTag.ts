export interface GroupedByTagSearchInput {
  queryString: string
  types: string[]
  tagType: string
  maxGroups?: number
  documentsPerGroup?: number
}

export interface GroupedByTagSearchGroup {
  key: string
  doc_count: number
  documents: {
    maxScore: { value: number | null }
    topHits: {
      hits: {
        hits: {
          _id: string
          _score: number
          _source: { response?: string }
        }[]
      }
    }
  }
}

export interface GroupedByTagSearchResponse {
  tags?: {
    filtered?: {
      groups?: {
        buckets: GroupedByTagSearchGroup[]
      }
    }
  }
}

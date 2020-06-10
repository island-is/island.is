import { SearcherService as Service } from '@island.is/api/schema'
import {
  Document as ContentDocument,
  ElasticService,
  SearchIndexes,
  SearchResult,
} from '@island.is/api/content-search'

export class SearcherService implements Service {
  constructor(private repository: ElasticService) {}

  getIndex(lang: string) {
    return SearchIndexes[lang] ?? SearchIndexes.is;
  }

  async find(query): Promise<SearchResult> {
    const { body } = await this.repository.query(this.getIndex(query.language), query)

    let items = body?.hits?.hits.map((hit) => {
      const obj = hit._source
      obj._id = hit._id
      return obj
    })

    return {
      total: items.length,
      items: items,
    }
  }

  async fetchCategories(query): Promise<ContentDocument> {
    const { body } = await this.repository.fetchCategories(
      this.getIndex(query.language),
      query,
    )

    return body?.aggregations?.categories?.buckets.map((category) => {
      return { title: category.key }
    })
  }

  async fetchSingle(input): Promise<ContentDocument> {
    const { body } = await this.repository.query(this.getIndex(input.language), input)

    const hit = body?.hits?.hits[0]
    if (!hit) {
      return null
    }

    const obj = hit._source
    obj._id = hit._id
    return obj
  }

  async fetchItems(input): Promise<ContentDocument> {
    const { body } = await this.repository.fetchItems(this.getIndex(input.language), input)

    return body?.hits?.hits.map((hit) => {
      let obj = hit._source
      obj._id = hit._id
      return obj
    })
  }
}

export default SearcherService

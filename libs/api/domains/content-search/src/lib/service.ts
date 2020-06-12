import {
  ContentCategory,
  SearcherService as Service,
} from '@island.is/api/schema'
import {
  Document as ContentDocument,
  ElasticService,
  SearchIndexes,
  SearchResult,
} from '@island.is/api/content-search'
import { RequestBodySearch } from 'elastic-builder'

export class SearcherService implements Service {
  constructor(private repository: ElasticService) {}

  getIndex(lang: string) {
    return SearchIndexes[lang] ?? SearchIndexes.is
  }

  private fixCase(doc) {
    const obj = doc._source
    obj.contentType = obj.content_type
    obj.contentBlob = obj.content_blob
    obj.contentId = obj.content_id
    obj.categorySlug = obj.category_slug
    obj.groupSlug = obj.group_slug
    obj.categoryDescription = obj._category.description
    obj.id = doc._id
    return obj
  }

  async find(query): Promise<SearchResult> {
    const { body } = await this.repository.query(
      this.getIndex(query.language),
      query,
    )

    const items = body?.hits?.hits.map(this.fixCase)

    return {
      total: items.length,
      items: items,
    }
  }

  async fetchCategories(query): Promise<ContentCategory> {
    // todo do properly not this awesome hack
    const queryTmp = new RequestBodySearch().size(1000)
    const { body } = await this.repository.findByQuery(
      this.getIndex(query.language),
      queryTmp,
    )
    const categories = {}
    body?.hits?.hits.forEach(({ _source }) => {
      if (!_source.category_slug) {
        return
      }
      categories[_source.category_slug] = _source._category
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return Object.values(categories)
  }

  async fetchSingle(input): Promise<ContentDocument> {
    const { body } = await this.repository.query(
      this.getIndex(input.language),
      input,
    )

    const hit = body?.hits?.hits[0]
    if (!hit) {
      return null
    }
    return this.fixCase(hit)
  }

  async fetchItems(input): Promise<ContentDocument> {
    const { body } = await this.repository.fetchItems(
      this.getIndex(input.language),
      input,
    )

    return body?.hits?.hits.map(this.fixCase)
  }
}

export default SearcherService

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

  private fixCase(doc: any) {
    const obj = doc._source
    obj.contentType = obj.content_type;
    obj.contentBlob = obj.content_blob;
    obj.contentId = obj.content_id;
    obj.categorySlug = obj.category_slug;
    obj.groupSlug = obj.group_slug;
    obj.id = doc._id
    return obj
  }

  async find(query): Promise<SearchResult> {
    const { body } = await this.repository.query(this.getIndex(query.language), query)

    let items = body?.hits?.hits.map(this.fixCase)

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

    return body?.aggregations?.categories?.buckets.map((category, index) => {
      console.log(category);
      return {
        title: category.key,
        slug: body?.aggregations?.catagories_slugs?.buckets[index].key,
      }
    })
  }

  async fetchSingle(input): Promise<ContentDocument> {
    const { body } = await this.repository.query(this.getIndex(input.language), input)

    const hit = body?.hits?.hits[0]
    if (!hit) {
      return null
    }
    return this.fixCase(hit);
  }

  async fetchItems(input): Promise<ContentDocument> {
    const { body } = await this.repository.fetchItems(this.getIndex(input.language), input)

    return body?.hits?.hits.map(this.fixCase)
  }
}

export default SearcherService

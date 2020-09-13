import { Injectable } from '@nestjs/common'
import { ElasticService, SearchIndexes } from '@island.is/api/content-search'
import { RequestBodySearch } from 'elastic-builder'
import { ContentCategory } from './models/contentCategory.model'
import { ContentItem } from './models/contentItem.model'
import { SearchResult } from './models/searchResult.model'
import { WebSearchAutocomplete } from './models/webSearchAutocomplete.model'
import { ContentLanguage } from './enums/contentLanguage.enum'
import { SearcherService } from '@island.is/api/schema'
import { logger } from '@island.is/logging'

@Injectable()
export class ContentSearchService implements SearcherService {
  constructor(private elasticService: ElasticService) {}

  getIndex(lang: ContentLanguage) {
    return SearchIndexes[lang] ?? SearchIndexes.is
  }

  private fixCase(doc) {
    const obj = doc._source
    obj.contentType = obj.content_type
    obj.contentBlob = obj.content_blob
    obj.contentId = obj.content_id
    obj.categorySlug = obj.category_slug
    obj.categoryDescription = obj.category_description
    obj.groupSlug = obj.group_slug
    obj.groupDescription = obj.group_description
    obj.id = doc._id
    return obj
  }

  async find(query): Promise<SearchResult> {
    // TODO: Make this returns search results by type e.g. [article]
    const { body } = await this.elasticService.query(
      this.getIndex(query.language),
      query,
    )

    return {
      total: body.hits.total.value,
      // we map data when it goes into the index we can return it without mapping it here
      items: body.hits.hits.map((item) => JSON.parse(item._source.response)),
    }
  }

  // TODO: use aggregation here
  async fetchCategories(query): Promise<ContentCategory[]> {
    // todo do properly not this awesome hack
    const queryTmp = new RequestBodySearch().size(1000)
    const { body } = await this.elasticService.deprecatedFindByQuery(
      this.getIndex(query.language),
      queryTmp,
    )
    const categories = {}
    body?.hits?.hits.forEach(({ _source }) => {
      if (!_source.category_slug) {
        return
      }
      categories[_source.category_slug] = {
        title: _source.category,
        slug: _source.category_slug,
        description: _source.category_description,
      }
    })

    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    return Object.values(categories)
  }

  async fetchSingle(input): Promise<ContentItem> {
    const { body } = await this.elasticService.query(
      this.getIndex(input.language),
      input,
    )

    const hit = body?.hits?.hits[0]
    if (!hit) {
      return null
    }
    return this.fixCase(hit)
  }

  async fetchItems(input): Promise<ContentItem[]> {
    const { body } = await this.elasticService.fetchItems(
      this.getIndex(input.language),
      input,
    )

    return body?.hits?.hits.map(this.fixCase)
  }

  async fetchAutocompleteTerm(input): Promise<WebSearchAutocomplete> {
    const {
      suggest: { searchSuggester },
    } = await this.elasticService.fetchAutocompleteTerm(
      this.getIndex(input.language),
      {
        ...input,
        singleTerm: input.singleTerm.trim(),
      },
    )

    // we always handle just one terms at a time so we return results for first term
    const firstWordSuggestions = searchSuggester[0].options

    return {
      total: firstWordSuggestions.length,
      completions: firstWordSuggestions.map(
        (suggestionObjects) => suggestionObjects.text,
      ),
    }
  }
}

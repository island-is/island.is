import { Injectable } from '@nestjs/common'
import {
  ElasticService,
  TagAggregationResponse,
  TypeAggregationResponse,
} from '@island.is/content-search-toolkit'
import { logger } from '@island.is/logging'
import { SearchResult } from './models/searchResult.model'
import { WebSearchAutocomplete } from './models/webSearchAutocomplete.model'
import { WebSearchAutocompleteSuggestions } from './models/webSearchAutocompleteSuggestions.model'
import { TagCount } from './models/tagCount'
import { SearcherInput } from './dto/searcher.input'
import { WebSearchAutocompleteInput } from './dto/webSearchAutocomplete.input'
import { WebSearchAutocompleteSuggestionsInput } from './dto/webSearchAutocompleteSuggestions.input'
import { TypeCount } from './models/typeCount'
import {
  ElasticsearchIndexLocale,
  getElasticsearchIndex,
} from '@island.is/content-search-index-manager'

@Injectable()
export class ContentSearchService {
  constructor(private elasticService: ElasticService) {}

  private getIndex(lang: ElasticsearchIndexLocale = 'is') {
    return getElasticsearchIndex(lang)
  }

  mapTagAggregations(aggregations: TagAggregationResponse): TagCount[] {
    if (!aggregations?.group) {
      return null
    }
    return aggregations.group.filtered.count.buckets.map<TagCount>(
      (tagObject) => ({
        key: tagObject.key,
        count: tagObject.doc_count.toString(),
        value: tagObject.value.buckets?.[0]?.key ?? '', // value of tag is always the first value here we provide default value since value is optional
      }),
    )
  }

  mapTypeAggregations(aggregations: TypeAggregationResponse): TypeCount[] {
    if (!aggregations?.typeCount) {
      return null
    }
    return aggregations.typeCount.buckets.map<TypeCount>((tagObject) => ({
      key: tagObject.key,
      count: tagObject.doc_count.toString(),
    }))
  }

  async find(query: SearcherInput): Promise<SearchResult> {
    const { body } = await this.elasticService.search(
      this.getIndex(query.language),
      query,
    )

    return {
      total: body.hits.total.value,
      // we map data when it goes into the index we can return it without mapping it here
      items: body.hits.hits.map((item) => JSON.parse(item._source.response)),
      tagCounts: this.mapTagAggregations(
        body.aggregations as TagAggregationResponse,
      ),
      typesCount: this.mapTypeAggregations(
        body.aggregations as TypeAggregationResponse,
      ),
    }
  }

  async fetchAutocompleteTerm(
    input: WebSearchAutocompleteInput,
  ): Promise<WebSearchAutocomplete> {
    logger.info('search index', {
      lang: input.language,
      index: this.getIndex(input.language),
    })
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

  async fetchAutocompleteSuggestion(
    input: WebSearchAutocompleteSuggestionsInput
  ): Promise<WebSearchAutocompleteSuggestions> {
    const {
      suggest: { contentSuggest, titleSuggest }
    } = await this.elasticService.fetchAutocompleteSuggestions(
      this.getIndex(input.language),
      {
        ...input
      }
    )
    console.log(contentSuggest, titleSuggest)
    return {
      completions: ["this is a test"]
    }
  }
}

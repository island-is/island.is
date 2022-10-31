import { Injectable } from '@nestjs/common'
import {
  ElasticService,
  TagAggregationResponse,
  TypeAggregationResponse,
  ProcessEntryAggregationResponse,
} from '@island.is/content-search-toolkit'
import { logger } from '@island.is/logging'
import { SearchResult } from './models/searchResult.model'
import { WebSearchAutocomplete } from './models/webSearchAutocomplete.model'
import { TagCount } from './models/tagCount'
import { SearcherInput } from './dto/searcher.input'
import { WebSearchAutocompleteInput } from './dto/webSearchAutocomplete.input'
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

  mapProcessEntryAggregations(
    aggregations: ProcessEntryAggregationResponse,
  ): number | undefined {
    if (!aggregations?.processEntryCount) {
      return
    }
    let total = 0
    for (const bucket of aggregations.processEntryCount.buckets) {
      total += bucket.doc_count * (bucket.key === 0 ? 0 : 1)
    }
    return total
  }

  mapTagAggregations(
    aggregations: TagAggregationResponse,
  ): TagCount[] | undefined {
    if (!aggregations?.group) {
      return
    }
    return aggregations.group.filtered.count.buckets.map<TagCount>(
      (tagObject) => {
        return {
          key: tagObject.key,
          count: tagObject.doc_count.toString(),
          value: tagObject.value.buckets?.[0]?.key ?? '', // value of tag is always the first value here we provide default value since value is optional
          type: tagObject.type.buckets?.[0]?.key ?? '',
        }
      },
    )
  }

  mapTypeAggregations(
    aggregations: TypeAggregationResponse,
  ): TypeCount[] | undefined {
    if (!aggregations?.typeCount) {
      return
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

   

    // intercept highlights
    let items = body.hits.hits.map((item) =>
      JSON.parse(item._source.response ?? '[]'),
    )

    // mix and match highlights
    for (let i = 0; i < body.hits.hits.length; i++) {
      if (body.hits.hits[i]?.highlight?.title) {
        items[i].title = body.hits.hits[i]?.highlight?.title[0]
      }
      if (body.hits.hits[i]?.highlight?.content) {
        items[i].intro = body.hits.hits[i]?.highlight?.content[0]
      }
    }

    // // MYSTERY
    // items = items.map(item=>({...item, title:"XXX",intro:"000"}));

    // console.log(body.hits.hits)
    return {
      total: body.hits.total.value,
      // we map data when it goes into the index we can return it without mapping it here
      items: items,
      tagCounts: this.mapTagAggregations(
        body.aggregations as TagAggregationResponse,
      ),
      typesCount: this.mapTypeAggregations(
        body.aggregations as TypeAggregationResponse,
      ),
      processEntryCount: this.mapProcessEntryAggregations(
        body.aggregations as ProcessEntryAggregationResponse,
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


    console.log("INPUT",input.singleTerm.trim())

    const completions = await this.elasticService.findByQuery(
      this.getIndex(input.language),
      {
        _source: { include: ['title'] },
        query: { prefix: { title: input.singleTerm.trim() } },
        highlight: {
          number_of_fragments: 3,
          fragment_size: 150,
          fields: { title: { pre_tags: ['<b>'], post_tags: ['</b>'] } },
        },
      },
    )


    const titles: string[] = []
    // @ts-ignore: Unreachable code error
    completions.body.hits.hits.forEach((item) => {
      titles.push(item.highlight.title[0])
      console.log(item._source.title)
    })
    
    const ret = {
      total: titles.length,
      completions:titles,
    }
    // // we always handle just one terms at a time so we return results for first term
    // const firstWordSuggestions = searchSuggester[0].options

    // const ret = {
    //   total: firstWordSuggestions.length,
    //   completions: firstWordSuggestions.map(
    //     (suggestionObjects) => suggestionObjects.text,
    //   ),
    // }
    // // console.log(ret)
    
    return ret
  }
}

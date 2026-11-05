import { Injectable } from '@nestjs/common'
import {
  ElasticService,
  TagAggregationResponse,
  TypeAggregationResponse,
  ProcessEntryAggregationResponse,
  SortDirection,
  sortRule,
  SortField,
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
import {
  PROJECT_PAGE_CHILD_SEARCH_TYPES,
  PROJECT_PAGE_SEARCH_TAG_TYPE,
  PROJECT_PARENT_SUBPAGE_SEARCH_TYPE,
} from '@island.is/cms'
import {
  DEFAULT_SEARCHABLE_CONTENT_TYPES,
  PROJECT_SCOPED_CONTENT_TYPES,
  SearchableContentTypes,
} from './enums/searchableContentTypes'
import { SearchableTags } from './enums/searchableTags'
import {
  addParentSubpageSlugToChapters,
  getProjectPageSearchChildLinks,
  mapProjectPageChildMatches,
  ProjectPageChildMatches,
} from './projectPageSearch'

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

  private isScopedToProject(input: SearcherInput) {
    return Boolean(
      input.tags?.some((tag) => tag.type === SearchableTags.project && tag.key),
    )
  }

  // Project subpages are only search results when the search is scoped to their project
  private getSearchTypes(input: SearcherInput) {
    const types = input.types?.length
      ? input.types
      : DEFAULT_SEARCHABLE_CONTENT_TYPES
    if (this.isScopedToProject(input)) {
      return types
    }
    // Types can have a boost appended to them, e.g. 'webArticle^2'
    return types.filter(
      (type) => !PROJECT_SCOPED_CONTENT_TYPES.includes(type.split('^')[0]),
    )
  }

  private shouldFindProjectPagesThroughChildren(input: SearcherInput) {
    const queryString = input.queryString?.trim()
    return (
      // Within a project its subpages are search results on their own, so they shouldn't also be listed under the project page
      !this.isScopedToProject(input) &&
      Boolean(queryString) &&
      queryString !== '*' &&
      (input.useQuery ?? 'default') === 'default' &&
      (!input.types?.length ||
        input.types.includes(SearchableContentTypes.webProjectPage))
    )
  }

  // Project subpages are not search results on their own, instead the project page they belong to is found through them
  private async findProjectPageChildMatches(
    index: string,
    queryString: string,
  ): Promise<ProjectPageChildMatches[]> {
    try {
      const groups = await this.elasticService.searchGroupedByTag(index, {
        queryString,
        types: PROJECT_PAGE_CHILD_SEARCH_TYPES,
        tagType: PROJECT_PAGE_SEARCH_TAG_TYPE,
      })
      return mapProjectPageChildMatches(groups)
    } catch (error) {
      logger.warn('Failed to search project page children', {
        message: error?.message,
      })
      return []
    }
  }

  private async addParentSubpagesToChapters(
    index: string,
    input: SearcherInput,
    items: { typename?: string; id?: string; parentSubpageSlug?: string }[],
  ) {
    const projectTags =
      input.tags?.filter((tag) => tag.type === SearchableTags.project) ?? []
    if (
      !projectTags.length ||
      !items.some((item) => item?.typename === 'ProjectSubpage')
    ) {
      return
    }
    try {
      const response = await this.elasticService.getDocumentsByMetaData(
        index,
        {
          types: [PROJECT_PARENT_SUBPAGE_SEARCH_TYPE],
          tags: projectTags,
          size: 100,
        },
      )
      addParentSubpageSlugToChapters(
        items,
        response.hits.hits.map((hit) => hit._source.response),
      )
    } catch (error) {
      // Chapters still link to themselves without their parent subpage
      logger.warn('Failed to find the parent subpages of project chapters', {
        message: error?.message,
      })
    }
  }

  async find(input: SearcherInput): Promise<SearchResult> {
    const {
      language,
      sort: sortBy,
      order = SortDirection.DESC,
      ...restInput
    } = input
    let sort: sortRule[] = []

    if (sortBy === SortField.TITLE) {
      sort = [{ 'title.sort': { order } }]
    }

    if (sortBy === SortField.POPULAR) {
      sort = [{ popularityScore: { order } }]
    }

    const types = this.getSearchTypes(input)

    // Only project subpages were asked for, outside of a project
    if (!types.length) {
      return { total: 0, items: [] }
    }

    const index = this.getIndex(language)

    const findProjectPagesThroughChildren =
      this.shouldFindProjectPagesThroughChildren(input)

    const projectPageChildMatches = findProjectPagesThroughChildren
      ? await this.findProjectPageChildMatches(index, input.queryString)
      : []

    const query = {
      ...restInput,
      // Searching without types would also return internal documents, like project subpages, that aren't search results
      types,
      sort,
      additionalDocumentMatches: projectPageChildMatches.map(
        ({ projectPageId, score }) => ({ id: projectPageId, boost: score }),
      ),
    }

    const { body } = await this.elasticService.search(index, query)

    const childMatchesByProjectPageId = new Map(
      projectPageChildMatches.map((match) => [match.projectPageId, match]),
    )

    // intercept highlights
    const items = body.hits.hits.map((item) => {
      const parsedItem = JSON.parse(item._source.response ?? '[]')
      if (
        findProjectPagesThroughChildren &&
        parsedItem?.typename === 'ProjectPage'
      ) {
        parsedItem.searchResultChildLinks = getProjectPageSearchChildLinks(
          parsedItem,
          childMatchesByProjectPageId.get(parsedItem.id),
          language ?? 'is',
        )
      }
      return parsedItem
    })

    await this.addParentSubpagesToChapters(index, input, items)

    // mix and match highlights
    if (query.highlightResults) {
      for (let i = 0; i < body.hits.hits.length; i++) {
        if (body.hits.hits[i]?.highlight?.title) {
          items[i].title = body.hits.hits[i]?.highlight?.title[0]
        }
        if (body.hits.hits[i]?.highlight?.content) {
          items[i].intro = body.hits.hits[i]?.highlight?.content[0]
        }
      }
    }

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

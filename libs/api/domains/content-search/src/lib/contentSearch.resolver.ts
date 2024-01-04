import { Args, Query, Resolver } from '@nestjs/graphql'
import { ContentSearchService } from './contentSearch.service'
import { SearcherInput } from './dto/searcher.input'
import { WebSearchAutocompleteInput } from './dto/webSearchAutocomplete.input'
import { SearchResult } from './models/searchResult.model'
import { WebSearchAutocomplete } from './models/webSearchAutocomplete.model'

@Resolver()
export class ContentSearchResolver {
  constructor(private contentSearchService: ContentSearchService) {}

  @Query(() => SearchResult)
  async searchResults(
    @Args('query') query: SearcherInput,
  ): Promise<SearchResult> {
    let response = await this.contentSearchService.find(query)
    if (!response.items.length) {
      let found = false
      query.tags = (query.tags ?? []).map((tag) => {
        if (tag?.type === 'organization' && tag.key === 'iceland-health') {
          found = true
          return {
            ...tag,
            key: 'icelandic-health-insurance',
          }
        }
        return tag
      })
      if (found) {
        response = await this.contentSearchService.find(query)
      }
    }
    return response
  }

  @Query(() => WebSearchAutocomplete)
  webSearchAutocomplete(
    @Args('input') input: WebSearchAutocompleteInput,
  ): Promise<WebSearchAutocomplete> {
    return this.contentSearchService.fetchAutocompleteTerm(input)
  }
}

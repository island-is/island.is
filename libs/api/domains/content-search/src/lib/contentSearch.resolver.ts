import { Args, Query, Resolver } from '@nestjs/graphql'
import { ContentSearchService } from './contentSearch.service'
import { SearcherInput } from './dto/searcher.input'
import { WebSearchAutocompleteInput } from './dto/webSearchAutocomplete.input'
import { WebSearchSuggestionsInput } from './dto/webSearchSuggestions.input'
import { SearchResult } from './models/searchResult.model'
import { WebSearchAutocomplete } from './models/webSearchAutocomplete.model'
import { WebSearchSuggestions } from './models/webSearchSuggestions.model'

@Resolver()
export class ContentSearchResolver {
  constructor(private contentSearchService: ContentSearchService) {}

  @Query(() => SearchResult)
  searchResults(@Args('query') query: SearcherInput): Promise<SearchResult> {
    return this.contentSearchService.find(query)
  }

  @Query(() => WebSearchAutocomplete)
  webSearchAutocomplete(
    @Args('input') input: WebSearchAutocompleteInput,
  ): Promise<WebSearchAutocomplete> {
    return this.contentSearchService.fetchAutocompleteTerm(input)
  }

  @Query(() => WebSearchSuggestions)
  webSearchSuggestions(
    @Args('input') input: WebSearchSuggestionsInput,
  ): Promise<WebSearchSuggestions> {
    return this.contentSearchService.fetchSuggestions(input)
  }
}

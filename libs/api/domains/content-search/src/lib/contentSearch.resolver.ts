import { Args, Query, Resolver } from '@nestjs/graphql'
import { ContentSearchService } from './contentSearch.service'
import { SearchResult } from './models/searchResult.model'
import { ContentItem } from './models/contentItem.model'
import { ItemInput } from './dto/item.input'
import { WebSearchAutocomplete } from './models/webSearchAutocomplete.model'
import { WebSearchAutocompleteInput } from './dto/webSearchAutocomplete.input'
import { SearcherInput } from './dto/searcher.input'

@Resolver()
export class ContentSearchResolver {
  constructor(private contentSearchService: ContentSearchService) {}

  @Query(() => SearchResult)
  searchResults(@Args('query') query: SearcherInput): Promise<SearchResult> {
    return this.contentSearchService.find(query)
  }

  @Query(() => ContentItem, { nullable: true })
  singleItem(@Args('input') input: ItemInput): Promise<ContentItem> {
    return this.contentSearchService.fetchSingle(input)
  }

  @Query(() => WebSearchAutocomplete)
  webSearchAutocomplete(
    @Args('input') input: WebSearchAutocompleteInput,
  ): Promise<WebSearchAutocomplete> {
    return this.contentSearchService.fetchAutocompleteTerm(input)
  }
}

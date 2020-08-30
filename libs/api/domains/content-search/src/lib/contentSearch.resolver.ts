import { Args, Query, Resolver } from '@nestjs/graphql'
import { ContentSearchService } from './contentSearch.service'
import { SearcherInput } from './dto/searcher.input'
import { SearchResult } from './models/searchResult.model'
import { ContentItem } from './models/contentItem.model'
import { ItemInput } from './dto/item.input'
import { ContentCategory } from './models/contentCategory.model'
import { CategoriesInput } from './dto/categories.input'
import { ArticlesInCategoryInput } from './dto/articlesInCategory.input'
import { WebSearchAutocomplete } from './models/webSearchAutocomplete.model'
import { WebSearchAutocompleteInput } from './dto/webSearchAutocomplete.input'

@Resolver()
export class ContentSearchResolver {
  constructor (private contentSearchService: ContentSearchService) {}

  @Query(() => SearchResult)
  searchResults (@Args('query') query: SearcherInput): Promise<SearchResult> {
    return this.contentSearchService.find(query)
  }

  @Query(() => ContentItem, { nullable: true })
  singleItem (@Args('input') input: ItemInput): Promise<ContentItem> {
    return this.contentSearchService.fetchSingle(input)
  }

  @Query(() => [ContentCategory])
  categories (
    @Args('input') input: CategoriesInput,
  ): Promise<ContentCategory[]> {
    return this.contentSearchService.fetchCategories(input)
  }

  @Query(() => [ContentItem])
  articlesInCategory (
    @Args('category') category: ArticlesInCategoryInput,
  ): Promise<ContentItem[]> {
    return this.contentSearchService.fetchItems(category)
  }

  @Query(() => WebSearchAutocomplete)
  webSearchAutocomplete (
    @Args('input') input: WebSearchAutocompleteInput,
  ): Promise<WebSearchAutocomplete> {
    return this.contentSearchService.fetchAutocompleteTerm(input)
  }
}

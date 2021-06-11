import { Resolver, Query, Args } from '@nestjs/graphql'
import { FreshdeskService } from './freshdesk.service'
import { Category, Search } from './graphql'
import { SearchInput } from './graphql/dto'

@Resolver()
export class FreshdeskResolver {
  constructor(private readonly freshdeskService: FreshdeskService) {}

  @Query(() => [Category])
  async freshdeskGetCategories(): Promise<Category[]> {
    return await this.freshdeskService.getCategories()
  }

  @Query(() => [Search])
  async freshdeskSearch(
    @Args('input', { type: () => SearchInput })
    input: SearchInput,
  ): Promise<Search[]> {
    return await this.freshdeskService.search(input.terms)
  }
}

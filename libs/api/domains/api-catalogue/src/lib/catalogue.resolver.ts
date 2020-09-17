import { Resolver, Query, Args } from '@nestjs/graphql'
import { ApiCatalogueService } from './catalogue.service'
import { ApiCatalogue } from './dto/catalogue.dto'
import { GetApiCatalogueInput } from './inputs/catalogue.input'

@Resolver()
export class ApiCatalogueResolver {
  constructor(private catalogueService: ApiCatalogueService) {}

  @Query(() => [ApiCatalogue])
  getApiCatalogues(): ApiCatalogue[] {
    return this.catalogueService.getCatalogues()
  }

  @Query(() => ApiCatalogue)
  getApiCatalogueById(
    @Args('input') input: GetApiCatalogueInput,
  ): ApiCatalogue {
    return this.catalogueService.getCatalogueById(input.id)
  }
}

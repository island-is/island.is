import { Resolver, Query, Args } from '@nestjs/graphql'
import { ApiCatalogueService } from './catalogue.service'
import { ApiCatalogue } from './models/catalogue.model'
import {
  GetApiCataloguesInput,
  GetApiServiceInput,
} from './dto/catalogue.input'

@Resolver()
export class ApiCatalogueResolver {
  constructor(private catalogueService: ApiCatalogueService) {}

  @Query(() => ApiCatalogue)
  async getApiCatalogues(
    @Args('input') input: GetApiCataloguesInput,
  ): Promise<ApiCatalogue> {
    return this.catalogueService.getCatalogues(input)
  }

  @Query(() => ApiCatalogue)
  async getApiCatalogueById(
    @Args('input') input: GetApiServiceInput,
  ): Promise<ApiCatalogue> {
    return this.catalogueService.getCatalogueById(input.id)
  }
}

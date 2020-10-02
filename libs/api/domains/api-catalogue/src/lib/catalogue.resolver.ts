import { Resolver, Query, Args } from '@nestjs/graphql'
import { ApiCatalogueService } from './catalogue.service'
import { ApiCatalogue, ApiService } from './models/catalogue.model'
import { GetApiCatalogueInput, GetApiServiceInput } from './dto/catalogue.input'

@Resolver()
export class ApiCatalogueResolver {
  constructor(private catalogueService: ApiCatalogueService) {}

  @Query(() => ApiCatalogue)
  async getApiCatalogue(
    @Args('input') input: GetApiCatalogueInput,
  ): Promise<ApiCatalogue> {
    return this.catalogueService.getCatalogue(input)
  }

  @Query(() => ApiService, { nullable: true })
  async getApiServiceById(
    @Args('input') input: GetApiServiceInput,
  ): Promise<ApiService> {
    return this.catalogueService.getApiServiceById(input.id)
  }
}

import { Resolver, Query, Args } from '@nestjs/graphql'
import { ApiCatalogueService } from './catalogue.service'
import { ApiCatalogue, ApiService } from './models/catalogue.model'
import { GetApiCatalogueInput, GetApiServiceInput } from './dto/catalogue.input'
import { OpenApi } from './models/openapi.model'
import { GetOpenApiInput } from './dto/openapi.input'

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
  ): Promise<ApiService | null> {
    return this.catalogueService.getApiServiceById(input.id)
  }

  @Query(() => OpenApi)
  async getOpenApi(@Args('input') input: GetOpenApiInput): Promise<OpenApi> {
    return this.catalogueService.getOpenApi(input)
  }
}

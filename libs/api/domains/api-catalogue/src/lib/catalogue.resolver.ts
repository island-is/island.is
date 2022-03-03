import { Args,Query, Resolver } from '@nestjs/graphql'

import { GetApiCatalogueInput, GetApiServiceInput } from './dto/catalogue.input'
import { GetOpenApiInput } from './dto/openapi.input'
import { ApiCatalogue } from './models/catalogue.model'
import { OpenApi } from './models/openapi.model'
import { Service } from './models/service.model'
import { ApiCatalogueService } from './catalogue.service'

@Resolver()
export class ApiCatalogueResolver {
  constructor(private catalogueService: ApiCatalogueService) {}

  @Query(() => ApiCatalogue)
  async getApiCatalogue(
    @Args('input') input: GetApiCatalogueInput,
  ): Promise<ApiCatalogue> {
    return this.catalogueService.getCatalogue(input)
  }

  @Query(() => Service, { nullable: true })
  async getApiServiceById(
    @Args('input') input: GetApiServiceInput,
  ): Promise<Service | null> {
    return this.catalogueService.getApiServiceById(input.id)
  }

  @Query(() => OpenApi)
  async getOpenApi(@Args('input') input: GetOpenApiInput): Promise<OpenApi> {
    return this.catalogueService.getOpenApi(input)
  }
}

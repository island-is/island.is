import { Resolver, Query, Args } from '@nestjs/graphql'
import { ApiCatalogueService } from './catalogue.service'
import { ApiCatalogue, ApiService } from './models/catalogue.model'
import {
  GetApiCataloguesInput,
  GetApiServiceInput,
} from './dto/catalogue.input'

@Resolver()
export class ApiCatalogueResolver {
  constructor(private catalogueService: ApiCatalogueService) {}

  @Query(() => ApiCatalogue)
  getApiCatalogues(@Args('input') input: GetApiCataloguesInput): ApiCatalogue {
    return this.catalogueService.getCatalogues(input)
  }

  @Query(() => ApiService)
  getApiCatalogueById(@Args('input') input: GetApiServiceInput): ApiService {
    return this.catalogueService.getCatalogueById(input.id)
  }
}

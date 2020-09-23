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
  getApiCatalogues(@Args('input') input: GetApiCataloguesInput): ApiCatalogue {
    return this.catalogueService.getCatalogues(input)
  }

  @Query(() => ApiCatalogue)
  getApiCatalogueById(@Args('input') input: GetApiServiceInput): ApiCatalogue {
    return this.catalogueService.getCatalogueById(input.id)
  }
}

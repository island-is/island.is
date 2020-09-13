import { Resolver, Query } from '@nestjs/graphql'
import { ApiCatalogueService } from './catalogue.service'
import { ApiCatalogue } from './dto/catalogue.dto'

@Resolver()
export class ApiCatalogueResolver {
  constructor(private catalogueService: ApiCatalogueService) {}

  @Query(() => [ApiCatalogue])
  catalogues(): ApiCatalogue[] {
    return this.catalogueService.getCatalogues()
  }
}

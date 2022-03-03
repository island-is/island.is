import { Module } from '@nestjs/common'

import { ElasticModule } from '@island.is/api-catalogue/elastic'
import { ApiCatalogueServicesModule } from '@island.is/api-catalogue/services'

import { ApiCatalogueResolver } from './catalogue.resolver'
import { ApiCatalogueService } from './catalogue.service'

@Module({
  imports: [ElasticModule, ApiCatalogueServicesModule],
  providers: [ApiCatalogueResolver, ApiCatalogueService],
})
export class ApiCatalogueModule {}

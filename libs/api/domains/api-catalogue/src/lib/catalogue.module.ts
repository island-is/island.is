import { Module } from '@nestjs/common'
import { ApiCatalogueResolver } from './catalogue.resolver'
import { ApiCatalogueService } from './catalogue.service'
import { ElasticModule } from '@island.is/api-catalogue/elastic'
import { ApiCatalogueServicesModule } from '@island.is/api-catalogue/services'

@Module({
  imports: [ElasticModule, ApiCatalogueServicesModule],
  providers: [ApiCatalogueResolver, ApiCatalogueService],
})
export class ApiCatalogueModule {}

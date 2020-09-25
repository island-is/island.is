import { Module } from '@nestjs/common'
import { ApiCatalogueResolver } from './catalogue.resolver'
import { ApiCatalogueService } from './catalogue.service'
import { ElasticModule } from '@island.is/api-catalogue/elastic'

@Module({
  imports: [ElasticModule],
  providers: [ApiCatalogueResolver, ApiCatalogueService],
})
export class ApiCatalogueModule {}

import { Module } from '@nestjs/common'
import { ApiCatalogueResolver } from './catalogue.resolver'
import { ApiCatalogueService } from './catalogue.service'

@Module({
  providers: [ApiCatalogueResolver, ApiCatalogueService],
})
export class ApiCatalogueModule {}

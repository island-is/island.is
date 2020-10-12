import { ElasticService } from '@island.is/api-catalogue/elastic'
import { Module } from '@nestjs/common'
import { CollectorScheduler } from './collector.scheduler'
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ApiCatalogueServicesModule } from '@island.is/api-catalogue/services'
import { RestServiceCollector } from './restservicecollector.service'

@Module({
  imports: [ApiCatalogueServicesModule],
  controllers: [],
  providers: [ElasticService, RestServiceCollector, CollectorScheduler],
})
export class AppModule {}

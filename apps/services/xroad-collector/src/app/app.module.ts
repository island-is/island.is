import { ElasticService } from '@island.is/api-catalogue/elastic'
import { Module } from '@nestjs/common'
import { CollectorScheduler } from './collector.scheduler'
import { ApiCatalogueServicesModule } from '@island.is/api-catalogue/services'
import { RestServiceCollector } from './restservicecollector.service'
import { ConfigModule } from '@nestjs/config'
import configuration from './config/configuration'
import { CollectionConfigService } from './collection-config.service'
import { CollectionService } from './collection.service'
import { ElasticConfigService } from '@island.is/api-catalogue/elastic'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    ApiCatalogueServicesModule,
  ],
  controllers: [],
  providers: [
    ElasticConfigService,
    CollectionConfigService,
    ElasticService,
    CollectionService,
    RestServiceCollector,
    CollectorScheduler,
  ],
})
export class AppModule {}

import { ElasticService } from '@island.is/api-catalogue/elastic'
import { Module } from '@nestjs/common'
import { CollectorScheduler } from './collector.scheduler'
import { ApiCatalogueServicesModule } from '@island.is/api-catalogue/services'
import { RestServiceCollector } from './restservicecollector.service'
import { ConfigModule } from '@nestjs/config'
import configuration from './config/configuration'
import { CollectionService } from './collection.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    ApiCatalogueServicesModule,
  ],
  controllers: [],
  providers: [
    ElasticService,
    CollectionService,
    RestServiceCollector,
    CollectorScheduler,
  ],
})
export class AppModule {}

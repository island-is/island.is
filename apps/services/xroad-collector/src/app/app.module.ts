import { ElasticService } from '@island.is/api-catalogue/elastic'
import { Module } from '@nestjs/common'
import { CollectorController } from './collector.controller'
import { ScheduleModule } from '@nestjs/schedule'
import { TasksModule } from './tasks'
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ApiCatalogueServicesModule } from '@island.is/api-catalogue/services'
import { RestServiceCollector } from './restservicecollector.service'

@Module({
  imports: [ScheduleModule.forRoot(), TasksModule, ApiCatalogueServicesModule],
  controllers: [CollectorController],
  providers: [ElasticService, RestServiceCollector],
})
export class AppModule {}

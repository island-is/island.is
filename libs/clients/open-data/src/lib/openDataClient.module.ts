import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { OpenDataClientService } from './openDataClient.service'
import { OpenDataClientConfig } from './openDataClient.config'

@Module({
  imports: [HttpModule, OpenDataClientConfig.registerOptional()],
  providers: [OpenDataClientService],
  exports: [OpenDataClientService],
})
export class OpenDataClientModule {}

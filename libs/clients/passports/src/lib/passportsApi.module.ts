import { Module } from '@nestjs/common'
import { PassportsApis, ApiConfiguration } from './PassportsApiProvider'
import { PassportsService } from './passportsApi.service'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import { LoggingModule } from '@island.is/logging'

@Module({
  imports: [NationalRegistryClientModule, LoggingModule],
  providers: [ApiConfiguration, PassportsService, ...PassportsApis],
  exports: [...PassportsApis, PassportsService],
})
export class PassportsClientModule {}

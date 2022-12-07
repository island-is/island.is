import { Module } from '@nestjs/common'
import { PassportsApis, ApiConfiguration } from './PassportsApiProvider'
import { PassportsService } from './passportsApi.service'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'

@Module({
  imports: [NationalRegistryClientModule],
  providers: [ApiConfiguration, PassportsService, ...PassportsApis],
  exports: [...PassportsApis, PassportsService],
})
export class PassportsClientModule {}

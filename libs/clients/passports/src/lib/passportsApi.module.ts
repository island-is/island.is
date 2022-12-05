import { Module } from '@nestjs/common'
import { PassportsApis, ApiConfiguration } from './PassportsApiProvider'
import { PassportsService } from './passportsApi.service'

@Module({
  providers: [ApiConfiguration, PassportsService, ...PassportsApis],
  exports: [...PassportsApis, PassportsService],
})
export class PassportsClientModule {}

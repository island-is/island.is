import { Module } from '@nestjs/common'
import { PassportsApis, ApiConfiguration } from './PassportsApiProvider'
import { PassportsService } from './passportsApi.service'
import { LoggingModule } from '@island.is/logging'

@Module({
  imports: [LoggingModule],
  providers: [ApiConfiguration, PassportsService, ...PassportsApis],
  exports: [...PassportsApis, PassportsService],
})
export class PassportsClientModule {}

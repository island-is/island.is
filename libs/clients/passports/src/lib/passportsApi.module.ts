import { Module } from '@nestjs/common'
import { PassportsApiProvider } from './PassportsApiProvider'
import { PassportsService } from './passportsApi.service'

@Module({
  providers: [PassportsApiProvider, PassportsService],
  exports: [PassportsApiProvider, PassportsService],
})
export class PassportsClientModule {}

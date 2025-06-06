import { Module } from '@nestjs/common'
import { BankinfoClientService } from './bankinfo.service'
import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'

@Module({
  providers: [ApiConfiguration, BankinfoClientService, ...exportedApis],
  exports: [BankinfoClientService],
})
export class BankinfoClientModule {}

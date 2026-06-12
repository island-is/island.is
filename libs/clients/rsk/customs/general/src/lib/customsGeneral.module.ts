import { Module } from '@nestjs/common'
import { CustomsGeneralApiConfig } from './customsGeneral.apiConfig'
import { CustomsGeneralClientService } from './customsGeneral.service'

@Module({
  providers: [CustomsGeneralApiConfig, CustomsGeneralClientService],
  exports: [CustomsGeneralClientService],
})
export class CustomsGeneralClientModule {}

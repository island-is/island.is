import { Module } from '@nestjs/common'
import { CustomsGeneralClientModule } from '@island.is/clients/rsk/customs/general'
import { CustomsGeneralService } from './customsGeneral.service'
import { CustomsGeneralResolver } from './customsGeneral.resolver'

@Module({
  imports: [CustomsGeneralClientModule],
  providers: [CustomsGeneralService, CustomsGeneralResolver],
  exports: [CustomsGeneralService],
})
export class CustomsGeneralDomainModule {}

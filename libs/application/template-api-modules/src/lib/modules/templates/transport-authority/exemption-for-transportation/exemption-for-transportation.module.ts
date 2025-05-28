import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { ExemptionForTransportationService } from './exemption-for-transportation.service'
import {
  ExemptionForTransportationClientConfig,
  ExemptionForTransportationClientModule,
} from '@island.is/clients/transport-authority/exemption-for-transportation'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    SharedTemplateAPIModule,
    ExemptionForTransportationClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ExemptionForTransportationClientConfig],
    }),
  ],
  providers: [ExemptionForTransportationService],
  exports: [ExemptionForTransportationService],
})
export class ExemptionForTransportationModule {}

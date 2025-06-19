import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../../shared'
import { ExemptionForTransportationService } from './exemption-for-transportation.service'
import { ExemptionForTransportationClientModule } from '@island.is/clients/transport-authority/exemption-for-transportation'
import { AwsModule } from '@island.is/nest/aws'

@Module({
  imports: [
    SharedTemplateAPIModule,
    ExemptionForTransportationClientModule,
    AwsModule,
  ],
  providers: [ExemptionForTransportationService],
  exports: [ExemptionForTransportationService],
})
export class ExemptionForTransportationModule {}

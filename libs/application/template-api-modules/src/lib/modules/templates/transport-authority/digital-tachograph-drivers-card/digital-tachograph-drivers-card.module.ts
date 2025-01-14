import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../../shared'
import { DigitalTachographDriversCardService } from './digital-tachograph-drivers-card.service'
import {
  DigitalTachographDriversCardClientModule,
  DigitalTachographDriversCardClientConfig,
} from '@island.is/clients/transport-authority/digital-tachograph-drivers-card'
import { DrivingLicenseApiModule } from '@island.is/clients/driving-license'

@Module({
  imports: [
    SharedTemplateAPIModule,
    DigitalTachographDriversCardClientModule,
    DrivingLicenseApiModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DigitalTachographDriversCardClientConfig],
    }),
  ],
  providers: [DigitalTachographDriversCardService],
  exports: [DigitalTachographDriversCardService],
})
export class DigitalTachographDriversCardModule {}

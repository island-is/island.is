import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import {
  DigitalTachographDriversCardClientModule,
  DigitalTachographDriversCardClientConfig,
} from '@island.is/clients/transport-authority/digital-tachograph-drivers-card'
import { MainResolver } from './graphql/main.resolver'
import { DigitalTachographApi } from './digitalTachograph.service'
import { DrivingLicenseApiModule } from '@island.is/clients/driving-license'

@Module({
  imports: [
    DigitalTachographDriversCardClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DigitalTachographDriversCardClientConfig],
    }),
    DrivingLicenseApiModule,
  ],
  providers: [MainResolver, DigitalTachographApi],
  exports: [DigitalTachographApi],
})
export class DigitalTachographApiModule {}

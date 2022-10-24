import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import {
  DigitalTachographDriversCardClientModule,
  DigitalTachographDriversCardClientConfig,
} from '@island.is/clients/transport-authority/digital-tachograph-drivers-card'
import { DigitalTachographApiResolver } from './digitalTachograph.resolver'
import { DigitalTachographApi } from './digitalTachograph.service'

@Module({
  imports: [
    DigitalTachographDriversCardClientModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [DigitalTachographDriversCardClientConfig],
    }),
  ],
  providers: [DigitalTachographApiResolver, DigitalTachographApi],
  exports: [DigitalTachographApi],
})
export class DigitalTachographApiModule {}

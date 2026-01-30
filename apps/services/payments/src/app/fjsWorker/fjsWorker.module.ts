import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ConfigModule } from '@nestjs/config'

import { SequelizeConfigService } from '@island.is/auth-api-lib'
import { LoggingModule } from '@island.is/logging'
import { AuditModule } from '@island.is/nest/audit'
import { XRoadConfig } from '@island.is/nest/config'

import { environment } from '../../environments'
import { FjsCharge } from '../paymentFlow/models/fjsCharge.model'
import { PaymentFulfillment } from '../paymentFlow/models/paymentFulfillment.model'
import { FjsWorkerService } from './fjsWorker.service'

@Module({
  imports: [
    LoggingModule,
    AuditModule.forRoot(environment.audit),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SequelizeModule.forFeature([FjsCharge, PaymentFulfillment]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [XRoadConfig],
      envFilePath: ['.env', '.env.secret'],
    }),
  ],
  providers: [FjsWorkerService],
})
export class FjsWorkerModule {}

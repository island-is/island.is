import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { ConfigModule } from '@nestjs/config'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'

// TODO
// import { AuditModule } from '@island.is/nest/audit'
import { ProblemModule } from '@island.is/nest/problem'
import { ChargeFjsV2ClientConfig } from '@island.is/clients/charge-fjs-v2'
import { XRoadConfig } from '@island.is/nest/config'

// import { environment } from '../environments'
import { PaymentFlowModule } from './paymentFlow/paymentFlow.module'
import { SequelizeConfigService } from '../sequelizeConfig.service'

@Module({
  imports: [
    // AuditModule.forRoot(environment.audit),
    ProblemModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    PaymentFlowModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [XRoadConfig, FeatureFlagConfig, ChargeFjsV2ClientConfig],
    }),
  ],
})
export class AppModule {}

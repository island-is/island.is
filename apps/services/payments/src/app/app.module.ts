import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

// TODO
// import { AuditModule } from '@island.is/nest/audit'
import { ProblemModule } from '@island.is/nest/problem'

// import { environment } from '../environments'
import { PaymentFlowModule } from './paymentFlow/paymentFlow.module'
import { ConfigModule } from '@nestjs/config'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'
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
      load: [FeatureFlagConfig],
    }),
  ],
})
export class AppModule {}

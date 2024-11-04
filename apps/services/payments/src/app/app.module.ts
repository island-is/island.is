import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

// TODO
// import { AuditModule } from '@island.is/nest/audit'
import { ProblemModule } from '@island.is/nest/problem'

// import { environment } from '../environments'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { PaymentFlowModule } from './paymentFlow/paymentFlow.module'

@Module({
  imports: [
    // AuditModule.forRoot(environment.audit),
    ProblemModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    PaymentFlowModule,
  ],
})
export class AppModule {}

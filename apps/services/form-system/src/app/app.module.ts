import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AuthModule } from '@island.is/auth-nest-tools'
import { AuditModule } from '@island.is/nest/audit'
import { environment } from '../environments'
import { FormModule } from './modules/forms/form.module'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { StepModule } from './modules/steps/step.module'
import { ProblemModule } from '@island.is/nest/problem'

@Module({
  imports: [
    AuthModule.register(environment.auth),
    AuditModule.forRoot(environment.audit),
    ProblemModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    FormModule,
    StepModule,
  ],
})
export class AppModule {}

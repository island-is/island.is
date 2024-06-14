import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AuthModule } from '@island.is/auth-nest-tools'
import { AuditModule } from '@island.is/nest/audit'
import { environment } from '../environments'
import { FormsModule } from './modules/forms/forms.module'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { StepsModule } from './modules/steps/steps.module'
import { ProblemModule } from '@island.is/nest/problem'
import { OrganizationsModule } from './modules/organizations/organizations.module'
import { GroupsModule } from './modules/groups/groups.module'
import { InputsModule } from './modules/inputs/inputs.module'
import { LoggingModule } from '@island.is/logging'

@Module({
  imports: [
    AuthModule.register(environment.auth),
    AuditModule.forRoot(environment.audit),
    // ProblemModule,
    LoggingModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    OrganizationsModule,
    FormsModule,
    StepsModule,
    GroupsModule,
    InputsModule,
  ],
})
export class AppModule {}

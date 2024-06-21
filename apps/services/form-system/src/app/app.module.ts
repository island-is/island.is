import { AuthModule } from '@island.is/auth-nest-tools'
import { LoggingModule } from '@island.is/logging'
import { AuditModule } from '@island.is/nest/audit'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { environment } from '../environments'
import { FormsModule } from './modules/forms/forms.module'
import { GroupsModule } from './modules/groups/groups.module'
import { InputSettingsModule } from './modules/inputSettings/inputSettings.module'
import { InputsModule } from './modules/inputs/inputs.module'
import { ListsModule } from './modules/lists/lists.module'
import { OrganizationsModule } from './modules/organizations/organizations.module'
import { StepsModule } from './modules/steps/steps.module'
import { TestimoniesModule } from './modules/testimonies/testimonies.module'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    AuthModule.register(environment.auth),
    AuditModule.forRoot(environment.audit),
    LoggingModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    OrganizationsModule,
    FormsModule,
    StepsModule,
    GroupsModule,
    InputsModule,
    TestimoniesModule,
    ListsModule,
    InputSettingsModule,
  ],
})
export class AppModule {}

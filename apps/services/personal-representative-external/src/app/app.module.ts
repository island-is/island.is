import { PermissionTypeModule } from './modules/permissionType/permissionType.module'
import { PersonalRepresentativePermissionModule } from './modules/personalRepresentativePermission/personalRepresentativePermission.module'
import { SequelizeConfigService } from '@island.is/auth-api-lib/personal-representative'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { environment } from '../environments'
import { AuditModule } from '@island.is/nest/audit'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    PermissionTypeModule,
    PersonalRepresentativePermissionModule,
  ],
})
export class AppModule {}

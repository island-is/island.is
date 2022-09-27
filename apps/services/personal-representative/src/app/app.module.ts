import { RightTypesModule } from './modules/rightTypes/rightTypes.module'
import { PersonalRepresentativesModule } from './modules/personalRepresentatives/personalRepresentatives.module'
import { PersonalRepresentativeTypesModule } from './modules/personalRepresentativeTypes/personalRepresentativeTypes.module'
import { AccessLogsModule } from './modules/accessLogs/accessLogs.module'
import { SequelizeConfigService } from '@island.is/auth-api-lib/personal-representative'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { environment } from '../environments'
import { AuditModule } from '@island.is/nest/audit'
import { AuthModule } from '@island.is/auth-nest-tools'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    RightTypesModule,
    PersonalRepresentativesModule,
    PersonalRepresentativeTypesModule,
    AccessLogsModule,
  ],
})
export class AppModule {}

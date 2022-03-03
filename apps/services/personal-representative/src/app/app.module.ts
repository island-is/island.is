import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { SequelizeConfigService } from '@island.is/auth-api-lib/personal-representative'
import { AuthModule } from '@island.is/auth-nest-tools'
import { AuditModule } from '@island.is/nest/audit'

import { environment } from '../environments'

import { AccessLogsModule } from './modules/accessLogs/accessLogs.module'
import { PersonalRepresentativesModule } from './modules/personalRepresentatives/personalRepresentatives.module'
import { PersonalRepresentativeTypesModule } from './modules/personalRepresentativeTypes/personalRepresentativeTypes.module'
import { RightTypesModule } from './modules/rightTypes/rightTypes.module'

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

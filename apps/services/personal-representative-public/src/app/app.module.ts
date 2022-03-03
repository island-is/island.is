import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { SequelizeConfigService } from '@island.is/auth-api-lib/personal-representative'
import { AuthModule } from '@island.is/auth-nest-tools'
import { AuditModule } from '@island.is/nest/audit'

import { environment } from '../environments'

import { PersonalRepresentativesModule } from './modules/personalRepresentatives/personalRepresentatives.module'
import { RightsModule } from './modules/rights/rights.module'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    RightsModule,
    PersonalRepresentativesModule,
  ],
})
export class AppModule {}

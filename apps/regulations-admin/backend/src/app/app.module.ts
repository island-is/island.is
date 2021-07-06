import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AuthModule } from '@island.is/auth-nest-tools'
import { AuditModule } from '@island.is/nest/audit'

import { environment } from '../environments'
import { DraftRegulationModule } from './modules/draft_regulation/draft_regulation.module'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    AuthModule.register(environment.auth),
    AuditModule.forRoot(environment.audit),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    DraftRegulationModule,
  ],
})
export class AppModule {}

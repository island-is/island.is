import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AuthModule } from '@island.is/auth-nest-tools'
import { AuditModule } from '@island.is/nest/audit'

import { environment } from '../environments'
import { DraftRegulationModule } from './modules/draft_regulation'
import { DraftRegulationChangeModule } from './modules/draft_regulation_change'
import { DraftRegulationCancelModule } from './modules/draft_regulation_cancel'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    AuthModule.register(environment.auth),
    AuditModule.forRoot(environment.audit),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    DraftRegulationModule,
    DraftRegulationChangeModule,
    DraftRegulationCancelModule,
  ],
})
export class AppModule {}

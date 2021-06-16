import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AuditModule } from '@island.is/nest/audit'

import { PartyLetterRegistryModule } from './modules/partyLetterRegistry/partyLetterRegistry.module'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { environment } from '../environments'

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    PartyLetterRegistryModule,
  ],
})
export class AppModule {}

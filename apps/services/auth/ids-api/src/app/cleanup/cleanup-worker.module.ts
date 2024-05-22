import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import {
  Grant,
  GrantsService,
  SequelizeConfigService,
} from '@island.is/auth-api-lib'
import { LoggingModule } from '@island.is/logging'

import { CleanupService } from './cleanup.service'

@Module({
  imports: [
    LoggingModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SequelizeModule.forFeature([Grant]),
  ],
  providers: [CleanupService, GrantsService],
})
export class CleanupWorkerModule {}

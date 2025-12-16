import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { FileStorageConfig } from '@island.is/file-storage'
import { LoggingModule } from '@island.is/logging'
import { AuditModule } from '@island.is/nest/audit'

import { environment } from '../../../../environments'
import { SequelizeConfigService } from '../../../sequelizeConfig.service'
import { PruneService } from './prune.service'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    LoggingModule,
    AuditModule.forRoot(environment.audit),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [FileStorageConfig],
    }),
  ],
  providers: [PruneService],
})
export class PruneModule {}

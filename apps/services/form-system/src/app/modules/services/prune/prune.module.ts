import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import { LoggingModule } from '@island.is/logging'
import { AuditModule } from '@island.is/nest/audit'

import { environment } from '../../../../environments'
import { SequelizeConfigService } from '../../../sequelizeConfig.service'
import { PruneService } from './prune.service'
import { Value } from '../../applications/models/value.model'
import { Application } from '../../applications/models/application.model'
import { ApplicationEvent } from '../../applications/models/applicationEvent.model'
import { FileConfig } from '../../file/file.config'
import { FileModule } from '../../file/file.module'
import { FileStorageWrapperModule } from '../../file/fileStorageWrapper'

@Module({
  imports: [
    SequelizeModule.forFeature([Value, Application, ApplicationEvent]),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    LoggingModule,
    FileModule,
    FileStorageWrapperModule,
    AuditModule.forRoot(environment.audit),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [FileConfig],
    }),
  ],
  providers: [PruneService],
})
export class PruneModule {}

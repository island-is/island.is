import { FileStorageConfig } from '@island.is/file-storage'
import { LoggingModule } from '@island.is/logging'
import { AuditModule } from '@island.is/nest/audit'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SequelizeModule } from '@nestjs/sequelize'
import environment from '../../../../environments/environment'
import { SequelizeConfigService } from '../../../sequelizeConfig.service'
import { Application } from '../../applications/models/application.model'
import { ApplicationEvent } from '../../applications/models/applicationEvent.model'
import { Value } from '../../applications/models/value.model'
import { FileConfig } from '../../file/file.config'
import { FileModule } from '../../file/file.module'
import { FileStorageWrapperModule } from '../../file/fileStorageWrapper'
import { PruneService } from './prune.service'

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
      load: [FileStorageConfig, FileConfig],
    }),
  ],
  providers: [PruneService],
})
export class PruneModule {}

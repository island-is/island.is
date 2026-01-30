import { LoggingModule } from '@island.is/logging'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { SequelizeConfigService } from '../../../sequelizeConfig.service'
import { Application } from '../../applications/models/application.model'
import { ApplicationEvent } from '../../applications/models/applicationEvent.model'
import { Value } from '../../applications/models/value.model'
import { PruneService } from './prune.service'

@Module({
  imports: [
    SequelizeModule.forFeature([Value, Application, ApplicationEvent]),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    LoggingModule,
    //   FileModule,
    //   AuditModule.forRoot(environment.audit),
    //   ConfigModule.forRoot({
    //     isGlobal: true,
    //     load: [FileStorageConfig, FileConfig],
    //   }),
  ],
  providers: [PruneService],
})
export class PruneModule {}

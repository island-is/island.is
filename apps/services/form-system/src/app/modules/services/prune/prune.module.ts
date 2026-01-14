import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { LoggingModule } from '@island.is/logging'
import { AuditModule } from '@island.is/nest/audit'

import { environment } from '../../../../environments'
import { SequelizeConfigService } from '../../../sequelizeConfig.service'
import { PruneService } from './prune.service'
import { Value } from '../../applications/models/value.model'
import { Application } from '../../applications/models/application.model'
import { ApplicationEvent } from '../../applications/models/applicationEvent.model'

@Module({
  imports: [
    SequelizeModule.forFeature([Value, Application, ApplicationEvent]),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    LoggingModule,
    AuditModule.forRoot(environment.audit),
  ],
  providers: [PruneService],
})
export class PruneModule {}

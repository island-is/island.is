import { LoggingModule } from '@island.is/logging';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

import { SequelizeConfigService } from '../../sequelizeConfig.service';
import { ActivitiesConfig } from '../activities.config';
import { Session } from '../sessions/session.model';
import { SessionsModule } from '../sessions/sessions.module';
import { SessionsService } from '../sessions/sessions.service';
import { ActivitiesProcessor } from './activities.processor';

@Module({
  imports: [
    LoggingModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SequelizeModule.forFeature([Session]),
    SessionsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ActivitiesConfig],
    }),
  ],
  providers: [ActivitiesProcessor, SessionsService],
})
export class WorkerModule {}

import { AuthModule } from '@island.is/auth-nest-tools';
import { AuditModule } from '@island.is/nest/audit';
import { ProblemModule } from '@island.is/nest/problem';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { environment } from '../environments';
import { SequelizeConfigService } from '../sequelizeConfig.service';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [
    AuditModule.forRoot(environment.audit),
    AuthModule.register(environment.auth),
    ProblemModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SessionsModule,
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common'
import { NotificationsModule } from './modules/notifications/notifications.module'

import { SequelizeModule } from '@nestjs/sequelize'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { AuthConfig, AuthModule } from '@island.is/auth-nest-tools'
import { environment } from '../environments/environment'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [
    AuthModule.register({
      issuer: environment.auth.issuer,
      // audience: intentionally left out
    } as AuthConfig),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),

    NotificationsModule,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common'
import { NotificationsModule } from './modules/notifications/notifications.module'

import { SequelizeModule } from '@nestjs/sequelize'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { AuthConfig, AuthModule } from '@island.is/auth-nest-tools'
import { environment } from '../environments/environment'

@Module({
  imports: [
    AuthModule.register({
      issuer: process.env.IDENTITY_SERVER_ISSUER_URL,
      // audience: intentionally left out
    } as AuthConfig),
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),

    NotificationsModule,
  ],
})
export class AppModule {}

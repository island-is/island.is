import { Module } from '@nestjs/common'
import { NotificationsModule } from './modules/notifications/notifications.module'

import { SequelizeModule } from '@nestjs/sequelize'
import { SequelizeConfigService } from './sequelizeConfig.service'
import {
  AuthConfig,
  AuthModule,
} from '@island.is/auth-nest-tools'

@Module({
  imports: [
    AuthModule.register({
      issuer: 'https://identity-server.dev01.devland.is',
      // audience: ['@island.is', '@admin.island.is'], // REMOVE THIS ... WE ARE NOT USING THIS ... THAT IS THE PLAN
    } as AuthConfig), // TODO: get from env

    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),

    NotificationsModule,
  ],
})
export class AppModule {}

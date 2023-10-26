import { Module } from '@nestjs/common'
import { NotificationsModule } from './modules/notifications/notifications.module'

import { SequelizeModule } from '@nestjs/sequelize'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { APP_GUARD } from '@nestjs/core'
import {
  AuthConfig,
  AuthModule,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'

@Module({
  imports: [
    // AuthModule.register({
    //   issuer: 'https://identity-server.dev01.devland.is',
    //   audience: ['@island.is', '@admin.island.is'],
    // } as AuthConfig),

    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),

    NotificationsModule,
  ],
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //     useClass: IdsUserGuard,
  //   },
  //   {
  //     provide: APP_GUARD,
  //     useClass: ScopesGuard,
  //   },

  // ],
})
export class AppModule {}

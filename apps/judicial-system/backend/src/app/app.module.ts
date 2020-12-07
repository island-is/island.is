import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { logger } from '@island.is/logging'

// Must import this before the shared auth module in local development
import { environment } from '../environments'
// Log the environment in local development
!environment.production &&
  logger.debug(JSON.stringify({ environment }, null, 4))

import { SharedAuthModule } from '@island.is/judicial-system/auth'

import { CaseModule, NotificationModule, UserModule } from './modules'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SharedAuthModule,
    UserModule,
    CaseModule,
    NotificationModule,
  ],
})
export class AppModule {}

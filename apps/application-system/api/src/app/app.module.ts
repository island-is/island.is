import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { SyslumennClientConfig } from '@island.is/clients/syslumenn'
import {
  ConfigModule,
  IdsClientConfig,
  XRoadConfig,
} from '@island.is/nest/config'
import { ProblemModule } from '@island.is/nest/problem'

import { SequelizeConfigService } from './sequelizeConfig.service'
import { ApplicationModule } from './modules/application/application.module'
import { AuthPublicApiClientConfig } from '@island.is/clients/auth-public-api'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    ApplicationModule,
    ProblemModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [IdsClientConfig, SyslumennClientConfig, XRoadConfig, AuthPublicApiClientConfig],
    }),
  ],
})
export class AppModule {}

import { SharedAuthModule } from '@island.is/financial-aid/auth'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { environment } from '../environments'
import {
  ApplicationModule,
  MunicipalityModule,
  ApplicationEventModule,
  FileModule,
} from './modules'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    SharedAuthModule.register({
      jwtSecret: environment.auth.jwtSecret,
      secretToken: environment.auth.secretToken,
    }),
    ApplicationModule,
    MunicipalityModule,
    FileModule,
    ApplicationEventModule,
  ],
})
export class AppModule {}

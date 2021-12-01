import { AuthModule } from '@island.is/auth-nest-tools'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { environment } from '../environments'

import {
  ApplicationModule,
  MunicipalityModule,
  ApplicationEventModule,
  FileModule,
  StaffModule,
  AidModule,
  AmountModule,
} from './modules'

import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    AuthModule.register(environment.identityServerAuth),
    StaffModule,
    ApplicationModule,
    MunicipalityModule,
    FileModule,
    ApplicationEventModule,
    AidModule,
    AmountModule,
  ],
})
export class AppModule {}

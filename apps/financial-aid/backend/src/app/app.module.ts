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
} from './modules'
import { AidModule } from './modules/aid'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    AuthModule.register(environment.identityServerAuth),
    ApplicationModule,
    MunicipalityModule,
    FileModule,
    ApplicationEventModule,
    AidModule,
    StaffModule,
  ],
})
export class AppModule {}

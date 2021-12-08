import { AuthModule } from '@island.is/auth-nest-tools'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { environment } from '../environments'
import { AuditModule } from '@island.is/nest/audit'

import {
  ApplicationModule,
  MunicipalityModule,
  ApplicationEventModule,
  FileModule,
  StaffModule,
  AidModule,
  AmountModule,
  DeductionFactorsModule,
} from './modules'

import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    AuthModule.register(environment.identityServerAuth),
    AmountModule,
    DeductionFactorsModule,
    StaffModule,
    ApplicationModule,
    MunicipalityModule,
    FileModule,
    ApplicationEventModule,
    AidModule,
    AuditModule.forRoot(environment.audit),
  ],
})
export class AppModule {}

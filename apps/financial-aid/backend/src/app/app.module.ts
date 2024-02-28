import { AuthModule } from '@island.is/auth-nest-tools'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { environment } from '../environments'
import { AuditModule } from '@island.is/nest/audit'

import {
  ApplicationModule,
  FileModule,
  StaffModule,
  MunicipalityModule,
  ApplicationEventModule,
  AidModule,
  AmountModule,
  DeductionFactorsModule,
  PersonalTaxReturnModule,
  DirectTaxPaymentModule,
  OpenApiApplicationModule,
  ApiUserModule,
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
    DirectTaxPaymentModule,
    StaffModule,
    ApplicationModule,
    OpenApiApplicationModule,
    MunicipalityModule,
    FileModule,
    ApplicationEventModule,
    AidModule,
    PersonalTaxReturnModule,
    ApiUserModule,
    AuditModule.forRoot(environment.audit),
  ],
})
export class AppModule {}

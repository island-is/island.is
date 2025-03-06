import { AuthModule } from '@island.is/auth-nest-tools'
import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { AuditModule, AuditConfig } from '@island.is/nest/audit'
import { ConfigModule } from '@island.is/nest/config'
import { emailModuleConfig } from '@island.is/email-service'

import { environment } from '../environments'
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
  ChildrenModule,
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
    ChildrenModule,
    AidModule,
    PersonalTaxReturnModule,
    ApiUserModule,
    AuditModule.forRoot({
      defaultNamespace: '@samband.is/financial-backend',
      serviceName: 'financial-aid-backend'
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [emailModuleConfig, AuditConfig],
    }),
  ],
})
export class AppModule {}

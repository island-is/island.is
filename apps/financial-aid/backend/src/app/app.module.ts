import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

// import { SharedAuthModule } from '@island.is/judicial-system/auth'

import { environment } from '../environments'
// import {
//   CaseModule,
//   FileModule,
//   InstitutionModule,
//   NotificationModule,
//   UserModule,
// } from './modules'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    // SharedAuthModule.register({
    //   jwtSecret: environment.auth.jwtSecret,
    //   secretToken: environment.auth.secretToken,
    // }),
    // UserModule,
    // CaseModule,
    // NotificationModule,
    // InstitutionModule,
    // FileModule,
  ],
})
export class AppModule {}

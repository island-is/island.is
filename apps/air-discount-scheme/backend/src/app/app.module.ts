import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { NationalRegistryModule } from './modules/nationalRegistry'
import { DiscountModule } from './modules/discount'
import { FlightModule } from './modules/flight'
import { UserModule } from './modules/user'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { environment } from '../environments'
import { AuthModule as AuthNestModule } from '@island.is/auth-nest-tools'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    AuthNestModule.register(environment.identityServerAuth),
    DiscountModule,
    FlightModule,
    UserModule,
    NationalRegistryModule,
  ],
})
export class AppModule {}

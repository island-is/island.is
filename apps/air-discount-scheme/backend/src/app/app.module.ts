import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { AuthModule as AuthNestModule } from '@island.is/auth-nest-tools'
import { NationalRegistryClientConfig } from '@island.is/clients/national-registry-v2'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'

import { environment } from '../environments'

import { DiscountModule } from './modules/discount'
import { FlightModule } from './modules/flight'
import { NationalRegistryModule as ADSNationalRegistryModule } from './modules/nationalRegistry'
import { UserModule } from './modules/user'
import { SequelizeConfigService } from './sequelizeConfig.service'

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    AuthNestModule.register(environment.identityServerAuth),
    DiscountModule,
    FlightModule,
    UserModule,
    ADSNationalRegistryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [XRoadConfig, NationalRegistryClientConfig],
    }),
  ],
})
export class AppModule {}

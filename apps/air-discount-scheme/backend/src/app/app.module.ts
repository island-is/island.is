import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { NationalRegistryModule as ADSNationalRegistryModule } from './modules/nationalRegistry'
import { DiscountModule } from './modules/discount'
import { FlightModule } from './modules/flight'
import { UserModule } from './modules/user'
import { SequelizeConfigService } from './sequelizeConfig.service'
import { environment } from '../environments'
import { AuthModule as AuthNestModule } from '@island.is/auth-nest-tools'
import { ConfigModule, XRoadConfig } from '@island.is/nest/config'
import { NationalRegistryClientConfig } from '@island.is/clients/national-registry-v2'
import { NationalRegistryV3ClientConfig } from '@island.is/clients/national-registry-v3'
import { FeatureFlagConfig } from '@island.is/nest/feature-flags'

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
      load: [
        XRoadConfig,
        NationalRegistryClientConfig,
        NationalRegistryV3ClientConfig,
        FeatureFlagConfig,
      ],
    }),
  ],
})
export class AppModule {}

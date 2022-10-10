import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'

import { SequelizeConfigService } from '@island.is/auth-api-lib'

import { DelegationsModule } from './v1/delegations/delegations.module'
import { DomainsModule } from './v1/domains/domains.module'
import { ConfigModule } from '@island.is/nest/config'

@Module({
  imports: [
    DelegationsModule,
    DomainsModule,
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        CompanyRegistryConfig,
        DelegationConfig,
        FeatureFlagConfig,
        IdsClientConfig,
        NationalRegistryClientConfig,
        RskProcuringClientConfig,
        UserProfileClientConfig,
        XRoadConfig,
      ],
    }),
  ],
})
export class AppModule {}

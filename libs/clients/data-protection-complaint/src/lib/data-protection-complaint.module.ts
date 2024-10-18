import { Module } from '@nestjs/common'
import { SecurityApi } from '../gen/fetch'

import { TokenMiddleware } from './data-protection-complaint-client.middleware'
import { exportedApis } from './apis'
import { ApiConfiguration } from './apiConfiguration'
import { ConfigType } from '@island.is/nest/config'
import { DataProtectionComplaintClientConfig } from './data-protection-complaint-client.config'

@Module({
  exports: [...exportedApis, TokenMiddleware],
  providers: [
    ApiConfiguration,
    {
      provide: TokenMiddleware,
      useFactory: (
        config: ConfigType<typeof DataProtectionComplaintClientConfig>,
        securityApi,
      ) => new TokenMiddleware(config, securityApi),
      inject: [DataProtectionComplaintClientConfig.KEY, SecurityApi],
    },
    ...exportedApis,
  ],
})
export class ClientsDataProtectionComplaintModule {}

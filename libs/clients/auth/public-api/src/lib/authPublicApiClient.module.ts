import { Module } from '@nestjs/common'

import { ApiConfiguration } from './apiConfiguration'
import { exportedApis } from './apis'
import { AuthPublicApiClientConfig } from './authPublicApiClient.config'

export const AuthPublicApiClientConfigProvider = {
  provide: AuthPublicApiClientConfig.KEY,
  useValue: AuthPublicApiClientConfig,
}
@Module({
  providers: [
    ApiConfiguration,
    AuthPublicApiClientConfigProvider,
    ...exportedApis,
  ],
  exports: exportedApis,
})
export class AuthPublicApiClientModule {}

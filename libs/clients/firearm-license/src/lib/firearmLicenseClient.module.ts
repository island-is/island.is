import { DynamicModule, Module } from '@nestjs/common'
import { FirearmApi } from './services/firearmApi.services'
import { OpenFirearmApi } from './services/openFirearmApi.services'
import { FirearmApiProvider } from './providers/firearmApiProvider'
import { OpenFirearmApiProvider } from './providers/openFirearmApiProvider'

@Module({})
export class FirearmLicenseClientModule {
  static register(useApiKeyAuth = false): DynamicModule {
    return {
      module: FirearmLicenseClientModule,
      providers: useApiKeyAuth
        ? [OpenFirearmApi, OpenFirearmApiProvider]
        : [FirearmApi, FirearmApiProvider],
      exports: useApiKeyAuth ? [OpenFirearmApi] : [FirearmApi],
    }
  }
}

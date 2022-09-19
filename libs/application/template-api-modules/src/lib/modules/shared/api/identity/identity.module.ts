import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { IdentityModule } from '@island.is/clients-identity'
import { IdentityApiService } from './identity.service'

export class IdentityProviderModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: IdentityProviderModule,
      imports: [IdentityModule],
      providers: [IdentityApiService],
      exports: [IdentityApiService],
    }
  }
}

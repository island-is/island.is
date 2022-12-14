import { DynamicModule } from '@nestjs/common'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { IdentityClientModule } from '@island.is/clients/identity'
import { IdentityService } from './identity.service'

export class IdentityModule {
  static register(config: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: IdentityModule,
      imports: [IdentityClientModule],
      providers: [IdentityService],
      exports: [IdentityService],
    }
  }
}

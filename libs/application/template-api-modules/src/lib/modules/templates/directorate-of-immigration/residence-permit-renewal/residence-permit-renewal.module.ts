import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { ResidencePermitRenewalService } from './residence-permit-renewal.service'
import {
  ResidencePermitClientModule,
  ResidencePermitClientConfig,
} from '@island.is/clients/directorate-of-immigration/residence-permit'

export class ResidencePermitRenewalModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: ResidencePermitRenewalModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        ResidencePermitClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [ResidencePermitClientConfig],
        }),
      ],
      providers: [ResidencePermitRenewalService],
      exports: [ResidencePermitRenewalService],
    }
  }
}

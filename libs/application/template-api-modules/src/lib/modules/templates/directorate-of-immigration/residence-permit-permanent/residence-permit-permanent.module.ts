import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { ResidencePermitPermanentService } from './residence-permit-permanent.service'
import {
  ResidencePermitClientModule,
  ResidencePermitClientConfig,
} from '@island.is/clients/directorate-of-immigration/residence-permit'

export class ResidencePermitPermanentModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: ResidencePermitPermanentModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        ResidencePermitClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [ResidencePermitClientConfig],
        }),
      ],
      providers: [ResidencePermitPermanentService],
      exports: [ResidencePermitPermanentService],
    }
  }
}

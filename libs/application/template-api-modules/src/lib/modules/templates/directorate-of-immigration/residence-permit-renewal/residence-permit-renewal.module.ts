import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { ResidencePermitRenewalService } from './residence-permit-renewal.service'
import {
  DirectorateOfImmigrationClientModule,
  DirectorateOfImmigrationClientConfig,
} from '@island.is/clients/directorate-of-immigration'

export class ResidencePermitRenewalModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: ResidencePermitRenewalModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        DirectorateOfImmigrationClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [DirectorateOfImmigrationClientConfig],
        }),
      ],
      providers: [ResidencePermitRenewalService],
      exports: [ResidencePermitRenewalService],
    }
  }
}

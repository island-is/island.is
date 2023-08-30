import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../../types'
import { ResidencePermitPermanentService } from './residence-permit-permanent.service'
import {
  DirectorateOfImmigrationClientModule,
  DirectorateOfImmigrationClientConfig,
} from '@island.is/clients/directorate-of-immigration'

export class ResidencePermitPermanentModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: ResidencePermitPermanentModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        DirectorateOfImmigrationClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [DirectorateOfImmigrationClientConfig],
        }),
      ],
      providers: [ResidencePermitPermanentService],
      exports: [ResidencePermitPermanentService],
    }
  }
}

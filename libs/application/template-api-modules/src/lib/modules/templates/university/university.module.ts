import { DynamicModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { SharedTemplateAPIModule } from '../../shared'
import { BaseTemplateAPIModuleConfig } from '../../../types'
import { UniversityService } from './university.service'
import { NationalRegistryClientModule } from '@island.is/clients/national-registry-v2'
import {
  UniversityGatewayApiClientConfig,
  UniversityGatewayApiClientModule,
} from '@island.is/clients/university-gateway-api'

export class UniversityModule {
  static register(baseConfig: BaseTemplateAPIModuleConfig): DynamicModule {
    return {
      module: UniversityModule,
      imports: [
        SharedTemplateAPIModule.register(baseConfig),
        NationalRegistryClientModule,
        UniversityGatewayApiClientModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [UniversityGatewayApiClientConfig],
        }),
      ],
      providers: [UniversityService],
      exports: [UniversityService],
    }
  }
}

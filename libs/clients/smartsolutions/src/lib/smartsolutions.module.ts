import { DynamicModule, Module, Scope } from '@nestjs/common'
import { SmartSolutionsApi, SmartSolutionsConfig } from './smartSolutions.api'
import { SMART_SOLUTIONS_API_CONFIG } from './smartSolutions.config'
import { ConfigType } from '@island.is/nest/config'

export type SmartSolutionsModuleAsyncOptions = {
  scope?: Scope
  useFactory: (config: ConfigType<never>) => SmartSolutionsConfig
  inject: Array<string>
}

@Module({})
export class SmartSolutionsApiClientModule {
  public static register(config: SmartSolutionsConfig): DynamicModule {
    return {
      module: SmartSolutionsApiClientModule,
      providers: [
        {
          provide: SMART_SOLUTIONS_API_CONFIG,
          useValue: config,
        },
        SmartSolutionsApi,
      ],
      exports: [SmartSolutionsApi],
    }
  }

  public static registerAsync(
    configProvider: SmartSolutionsModuleAsyncOptions,
  ): DynamicModule {
    return {
      module: SmartSolutionsApiClientModule,
      providers: [
        {
          ...configProvider,
          provide: SMART_SOLUTIONS_API_CONFIG,
        },
        SmartSolutionsApi,
      ],
      exports: [SmartSolutionsApi],
    }
  }
}

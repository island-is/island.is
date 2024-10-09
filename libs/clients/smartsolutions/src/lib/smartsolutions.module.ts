import { DynamicModule, Module } from '@nestjs/common'
import { SmartSolutionsApi, SmartSolutionsConfig } from './smartSolutions.api'
import { SMART_SOLUTIONS_API_CONFIG } from './smartSolutions.config'
import { LazyDuringDevScope } from '@island.is/nest/config'

export type SmartSolutionsModuleAsyncOptions = {
  useFactory: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) => Promise<SmartSolutionsConfig> | SmartSolutionsConfig
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inject?: any[]
}

@Module({})
/** @deprecated */
export class SmartSolutionsApiClientModule {
  public static register(config: SmartSolutionsConfig): DynamicModule {
    return {
      module: SmartSolutionsApiClientModule,
      providers: [
        {
          scope: LazyDuringDevScope,
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
          scope: LazyDuringDevScope,
          ...configProvider,
          provide: SMART_SOLUTIONS_API_CONFIG,
        },
        SmartSolutionsApi,
      ],
      exports: [SmartSolutionsApi],
    }
  }
}

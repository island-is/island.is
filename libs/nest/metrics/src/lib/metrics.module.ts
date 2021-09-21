import { DynamicModule, Global, Module } from '@nestjs/common'
import { MetricsOptions, METRICS_OPTIONS } from './metrics.options'
import { MetricsService } from './metrics.service'

@Global()
@Module({
  controllers: [],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class MetricsModule {
  static forRoot(options: MetricsOptions): DynamicModule {
    return {
      module: MetricsModule,
      providers: [
        {
          provide: METRICS_OPTIONS,
          useValue: options,
        },
      ],
    }
  }
}

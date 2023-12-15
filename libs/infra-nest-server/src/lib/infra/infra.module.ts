import { DynamicModule, Module, Type } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'

import { LoggingModule } from '@island.is/logging'

import { ApmInterceptor } from './apm.interceptor'
import { InfraController } from './infra.controller'
import { HealthModule } from './health/health.module'
import { HealthCheckOptions } from './health/types'

interface InfraModuleOptions {
  appModule: Type<any>
  healthCheck?: boolean | HealthCheckOptions
}

@Module({
  controllers: [InfraController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ApmInterceptor,
    },
  ],
  imports: [LoggingModule],
})
export class InfraModule {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static forRoot({
    appModule,
    healthCheck,
  }: InfraModuleOptions): DynamicModule {
    const imports = [appModule]
    return {
      module: InfraModule,
      imports: [
        ...imports,
        ...(healthCheck === false
          ? []
          : [
              HealthModule.register(
                healthCheck === true ? undefined : healthCheck,
              ),
            ]),
      ],
    }
  }
}

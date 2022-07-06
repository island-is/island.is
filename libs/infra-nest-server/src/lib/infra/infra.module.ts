import { DynamicModule, Module, Type } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'

import { LoggingModule } from '@island.is/logging'

import { InfraController } from './infra.controller'
import { ApmInterceptor } from './apm.interceptor'

interface InfraModuleOptions {
  appModule: Type<any>
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
  static forRoot({ appModule }: InfraModuleOptions): DynamicModule {
    const imports = [appModule]
    return {
      module: InfraModule,
      imports,
    }
  }
}

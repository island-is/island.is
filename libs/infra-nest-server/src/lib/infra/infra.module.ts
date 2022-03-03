import { DynamicModule, Module, Type } from '@nestjs/common'

import { LoggingModule } from '@island.is/logging'

import { InfraController } from './infra.controller'

interface InfraModuleOptions {
  appModule: Type<any>
}

@Module({
  controllers: [InfraController],
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

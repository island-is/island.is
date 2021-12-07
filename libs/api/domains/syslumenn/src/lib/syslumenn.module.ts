import { DynamicModule } from '@nestjs/common'
import { SyslumennResolver } from './syslumenn.resolver'
import { SyslumennService } from './syslumenn.service'
import { SyslumennApiModule, SyslumennApiConfig } from '@island.is/clients/syslumenn'


export class SyslumennModule {

  static register(config: SyslumennApiConfig): DynamicModule {
    return {
      module: SyslumennModule,
      imports: [
        SyslumennApiModule.register(config)
      ],
      providers: [
        SyslumennResolver,
        SyslumennService,
        {
          provide: "SYSLUMENN_CLIENT_CONFIG",
          useValue: config,
        },
      ],
      exports: [SyslumennService],
    }
  }
}

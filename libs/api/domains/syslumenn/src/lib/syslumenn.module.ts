import { DynamicModule, HttpModule } from '@nestjs/common'
import {
  SYSLUMENN_CLIENT_CONFIG,
  SyslumennClient,
  SyslumennClientConfig,
} from './client/syslumenn.client'
import { SyslumennResolver } from './syslumenn.resolver'
import { SyslumennService } from './syslumenn.service'
import { SyslumennApiModule, SyslumennApiConfig } from '@island.is/clients/syslumenn'

export class SyslumennModule {
  static register(config: SyslumennApiConfig): DynamicModule {
    return {
      module: SyslumennModule,
      imports: [
        HttpModule.register({
          timeout: 10000,
        }),
        SyslumennApiModule.register(config)
      ],
      providers: [
        SyslumennResolver,
        SyslumennService,
        SyslumennClient,
        {
          provide: SYSLUMENN_CLIENT_CONFIG,
          useValue: config,
        },
      ],
      exports: [SyslumennService],
    }
  }
}

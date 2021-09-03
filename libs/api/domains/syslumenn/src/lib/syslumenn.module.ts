import { DynamicModule } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import {
  SYSLUMENN_CLIENT_CONFIG,
  SyslumennClient,
  SyslumennClientConfig,
} from './client/syslumenn.client'
import { SyslumennResolver } from './syslumenn.resolver'
import { SyslumennService } from './syslumenn.service'

export class SyslumennModule {
  static register(config: SyslumennClientConfig): DynamicModule {
    return {
      module: SyslumennModule,
      imports: [
        HttpModule.register({
          timeout: 10000,
        }),
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

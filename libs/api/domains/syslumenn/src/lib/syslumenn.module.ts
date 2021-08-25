import { DynamicModule, HttpModule } from '@nestjs/common'
import {
  SYSLUMENN_CLIENT_CONFIG,
  SyslumennClient,
  SyslumennClientConfig,
} from './client/syslumenn.client'
import { SyslumennResolver } from './syslumenn.resolver'
import { SyslumennService } from './syslumenn.service'
import https, { Agent } from 'https'

export class SyslumennModule {
  static register(config: SyslumennClientConfig): DynamicModule {
    return {
      module: SyslumennModule,
      imports: [
        HttpModule.register({
          httpsAgent: new https.Agent({
            rejectUnauthorized: false,
            timeout: 10000,
          }),
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

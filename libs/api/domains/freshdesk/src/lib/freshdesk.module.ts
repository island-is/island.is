import { DynamicModule, Module } from '@nestjs/common'
import { freshdeskApi, FreshdeskConfig } from '@island.is/clients/freshdesk'
import { FreshdeskService } from './freshdesk.service'
import { FreshdeskResolver } from './freshdesk.resolver'

@Module({})
export class FreshdeskModule {
  static register(freshdeskConfig: FreshdeskConfig): DynamicModule {
    return {
      module: FreshdeskModule,
      providers: [
        FreshdeskResolver,
        FreshdeskService,
        {
          provide: freshdeskApi,
          useFactory: async () => new freshdeskApi(freshdeskConfig),
        },
      ],
    }
  }
}

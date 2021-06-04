import { DynamicModule } from '@nestjs/common'

import {
  ZendeskService,
  ZendeskServiceOptions,
  ZENDESK_OPTIONS,
} from './zendesk.service'

export class ZendeskModule {
  static register(options: ZendeskServiceOptions): DynamicModule {
    return {
      module: ZendeskModule,
      providers: [
        {
          provide: ZENDESK_OPTIONS,
          useValue: options,
        },
        ZendeskService,
      ],
      exports: [ZendeskService],
    }
  }
}

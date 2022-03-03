import { DynamicModule } from '@nestjs/common'

import {
  ZENDESK_OPTIONS,
  ZendeskService,
  ZendeskServiceOptions,
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

import { DynamicModule } from '@nestjs/common'

import { SMS_OPTIONS,SmsService, SmsServiceOptions } from './sms.service'

export class SmsModule {
  static register(options: SmsServiceOptions): DynamicModule {
    return {
      module: SmsModule,
      providers: [
        {
          provide: SMS_OPTIONS,
          useFactory: () => options,
        },
        SmsService,
      ],
      exports: [SmsService],
    }
  }
}

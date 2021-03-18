import { DynamicModule } from '@nestjs/common'

import { SmsService, SmsServiceOptions, SMS_OPTIONS } from './sms.service'

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

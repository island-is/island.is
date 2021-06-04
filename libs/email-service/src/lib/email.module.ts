import { DynamicModule } from '@nestjs/common'

import {
  EmailService,
  EmailServiceOptions,
  EMAIL_OPTIONS,
} from './email.service'

export class EmailModule {
  static register(options: EmailServiceOptions): DynamicModule {
    return {
      module: EmailModule,
      providers: [
        {
          provide: EMAIL_OPTIONS,
          useFactory: () => options,
        },
        EmailService,
      ],
      exports: [EmailService],
    }
  }
}

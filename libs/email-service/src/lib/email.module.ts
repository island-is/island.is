import { DynamicModule } from '@nestjs/common'

import { AdapterService } from '../tools/adapter.service'
import {
  EMAIL_OPTIONS,
  EmailService,
  EmailServiceOptions,
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
        AdapterService,
      ],
      exports: [EmailService],
    }
  }
}

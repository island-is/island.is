import { DynamicModule } from '@nestjs/common'

import {
  SIGNING_OPTIONS,
  SigningService,
  SigningServiceOptions,
} from './signing.service'

export class SigningModule {
  static register(options: SigningServiceOptions): DynamicModule {
    return {
      module: SigningModule,
      providers: [
        {
          provide: SIGNING_OPTIONS,
          useFactory: () => options,
        },
        SigningService,
      ],
      exports: [SigningService],
    }
  }
}

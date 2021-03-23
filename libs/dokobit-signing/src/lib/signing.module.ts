import { DynamicModule } from '@nestjs/common'

import {
  SigningService,
  SigningServiceOptions,
  SIGNING_OPTIONS,
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

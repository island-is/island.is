import { Test } from '@nestjs/testing'

import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { ConfigModule } from '@island.is/nest/config'

import { AdapterService } from '../../tools/adapter.service'
import { emailModuleConfig } from '../email.config'
import { EmailService } from '../email.service'

export const createTestingEmailModule = async () => {
  const emailModule = await Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        load: [emailModuleConfig],
      }),
    ],
    providers: [
      EmailService,
      {
        provide: LOGGER_PROVIDER,
        useValue: logger,
      },
      AdapterService,
    ],
  }).compile()

  return emailModule
}

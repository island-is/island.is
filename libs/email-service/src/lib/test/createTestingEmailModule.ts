import { Test } from '@nestjs/testing'

import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { EmailService, EMAIL_OPTIONS } from '../email.service'
import { AdapterService } from '../../tools/adapter.service'

export const createTestingEmailModule = async () => {
  const emailModule = await Test.createTestingModule({
    providers: [
      EmailService,
      {
        provide: EMAIL_OPTIONS,
        useValue: {
          useTestAccount: true,
        },
      },
      {
        provide: LOGGER_PROVIDER,
        useValue: logger,
      },
      AdapterService,
    ],
  }).compile()

  return emailModule
}

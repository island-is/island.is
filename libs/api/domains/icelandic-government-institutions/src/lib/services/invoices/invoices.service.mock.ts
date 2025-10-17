import { ElfurClientService } from '@island.is/clients/elfur'
import { Inject, Injectable } from '@nestjs/common'
import { isDefined } from '@island.is/shared/utils'
import { IInvoicesService } from './invoices.service.interface'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class MockInvoicesService implements IInvoicesService {
  constructor(@Inject(LOGGER_PROVIDER) private readonly logger: Logger) {
    this.logger.info('Using InvoicesServiceMock')
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getOpenInvoices(): Promise<any> {
    return 1
  }
}

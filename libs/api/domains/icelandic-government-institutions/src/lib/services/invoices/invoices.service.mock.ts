import { Inject, Injectable } from '@nestjs/common'
import { IInvoicesService } from './invoices.service.interface'
import { type Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { MOCK_INVOICES } from '../../mocks/INVOICES'
import { InvoiceList } from '../../models/invoiceList.model'

@Injectable()
export class MockInvoicesService implements IInvoicesService {
  constructor(@Inject(LOGGER_PROVIDER) private readonly logger: Logger) {
    this.logger.info('Using InvoicesServiceMock')
  }
  async getOpenInvoices(): Promise<InvoiceList | null>{
    return MOCK_INVOICES
  }
}

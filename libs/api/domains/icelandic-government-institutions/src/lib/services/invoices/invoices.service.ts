import { ElfurClientService } from '@island.is/clients/elfur'
import { Injectable } from '@nestjs/common'
import { type IInvoicesService } from './invoices.service.interface'
import { InvoiceList } from '../../models/invoiceList.model'
import { InvoiceListInput } from '../../dtos/getInvoiceList.input'
import { mapInvoiceList } from '../../mappers/invoiceMapper'

@Injectable()
export class InvoicesService implements IInvoicesService {
  constructor(private elfurService: ElfurClientService) {}

  async getOpenInvoices(input: InvoiceListInput): Promise<InvoiceList | null> {
    const data = await this.elfurService.getOpenInvoices(input)

    if (!data) {
      return null
    }

    return mapInvoiceList(data)
  }
}

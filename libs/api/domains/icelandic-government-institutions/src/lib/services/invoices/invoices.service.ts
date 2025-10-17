import { ElfurClientService } from '@island.is/clients/elfur'
import { Injectable } from '@nestjs/common'
import { IInvoicesService } from './invoices.service.interface'
import { InvoiceList } from '../../models/invoiceList.model'

@Injectable()
export class InvoicesService implements IInvoicesService {
  constructor(private elfurService: ElfurClientService) {}

  async getOpenInvoices(): Promise<InvoiceList | null> {
    const data = await this.elfurService.getOpenInvoices()

    if (!data) {
      return null
    }

    return {
      pageInfo: data.pageInfo,
      totalCount: data.totalCount,
      data:
        data.invoices?.map((invoice) => ({
          cacheId: invoice.cacheId,
          number: invoice.id,
        })) ?? [],
    }
  }
}

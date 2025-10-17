import { ElfurClientService } from '@island.is/clients/elfur'
import { Injectable } from '@nestjs/common'
import { IInvoicesService } from './invoices.service.interface'

@Injectable()
export class InvoicesService implements IInvoicesService {
  constructor(private elfurService: ElfurClientService) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getOpenInvoices(): Promise<any> {
    const data = await this.elfurService.getOpenInvoices()

    return 0
  }
}

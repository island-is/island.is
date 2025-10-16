import { ElfurClientService } from '@island.is/clients/elfur'
import { Injectable } from '@nestjs/common'
import { EmployeeList } from '../models/employeeList.model'
import { mapEmployee } from '../mappers/employeeMapper'
import { isDefined } from '@island.is/shared/utils'

@Injectable()
export class InvoicesService {
  constructor(private elfurService: ElfurClientService) {}

  async getOpenInvoices(): Promise<EmployeeList> {
    const data = await this.elfurService.getOpenInvoices()

    return {
      data: data.map((e) => mapEmployee(e)).filter(isDefined),
      totalCount: data.length,
      //until better
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      },
    }
  }
}

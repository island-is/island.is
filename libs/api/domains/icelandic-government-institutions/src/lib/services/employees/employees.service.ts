import { ElfurClientService } from '@island.is/clients/elfur'
import { Injectable } from '@nestjs/common'
import { EmployeeList } from '../../models/employeeList.model'
import { mapEmployee } from '../../mappers/employeeMapper'
import { isDefined } from '@island.is/shared/utils'
import { type IEmployeesService } from './employees.service.interface'

@Injectable()
export class EmployeesService implements IEmployeesService {
  constructor(private elfurService: ElfurClientService) {}

  async getEmployees(organizationId: string): Promise<EmployeeList> {
    const data = await this.elfurService.getOrganizationEmployees(
      organizationId,
    )

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

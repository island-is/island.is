import { type User } from "@island.is/auth-nest-tools";
import { ElfurClientService } from "@island.is/clients/elfur";
import { Injectable } from "@nestjs/common";
import { EmployeeList } from "./models/employeeList.model";
import { mapEmployee } from "./mappers/employeeMapper";
import {isDefined} from '@island.is/shared/utils'

@Injectable()
export class EmployeesService {
  constructor(
    private elfurService: ElfurClientService,
  ) { }

  async getEmployees(user: User, organizationId: string): Promise<EmployeeList> {
    const data = await this.elfurService.getOrganizationEmployees(user, organizationId)

    return {
      data: data.map(e => mapEmployee(e)).filter(isDefined),
      totalCount: data.length,
      //until better
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
      }
    }
  }
}

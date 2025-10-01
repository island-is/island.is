import { Injectable } from '@nestjs/common'
import { EmployeeBasicResponseDto, OrganizationEmployeeApi } from '../../gen/fetch'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'

@Injectable()
export class ElfurClientService {
  constructor(
    private readonly api: OrganizationEmployeeApi
  ) { }

  private apiWithAuth = (user: User) =>
    this.api.withMiddleware(new AuthMiddleware(user as Auth))

  public async getOrganizationEmployees(user: User, organizationId: string): Promise<Array<EmployeeBasicResponseDto>> {
    return this.apiWithAuth(user).v1OrganizationEmployeeGetEmployeesForOrganizationGet({organizationNumber: organizationId})
  }
}

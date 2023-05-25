import { MachinesApi } from '@island.is/clients/work-machines'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'

export class WorkMachinesService {
  constructor(private machinesApi: MachinesApi) {}

  getWorkMachines = (auth: User) =>
    this.machinesApi.withMiddleware(new AuthMiddleware(auth)).apiMachinesGet({})
}

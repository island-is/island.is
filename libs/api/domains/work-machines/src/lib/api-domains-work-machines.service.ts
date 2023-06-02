import { MachinesApi } from '@island.is/clients/work-machines'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'

export class WorkMachinesService {
  constructor(private readonly machinesApi: MachinesApi) {}

  private apiWithAuth = (user: User) =>
    this.machinesApi.withMiddleware(new AuthMiddleware(user as Auth))

  getWorkMachines = (user: User) => this.apiWithAuth(user).apiMachinesGet({})

  getWorkMachineById = (user: User, machineId: string, locale: string) =>
    this.apiWithAuth(user).getMachine({ id: machineId, locale })
}

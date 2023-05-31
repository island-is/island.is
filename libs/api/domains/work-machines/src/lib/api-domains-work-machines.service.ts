import { MachinesApi } from '@island.is/clients/work-machines'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
export class WorkMachinesService {
  constructor(private readonly machinesApi: MachinesApi) {}

  async getWorkMachines(user: User) {
    const machines = await this.machinesApi
      .withMiddleware(new AuthMiddleware(user as Auth))
      .apiMachinesGet({})
    console.log(machines)
    return machines
  }
}

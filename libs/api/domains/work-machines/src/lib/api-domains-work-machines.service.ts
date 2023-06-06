import { WorkMachinesClientService } from '@island.is/clients/work-machines'
import { User } from '@island.is/auth-nest-tools'
import { WorkMachine } from './models/getWorkMachines'
import { Injectable } from '@nestjs/common'
@Injectable()
export class WorkMachinesService {
  constructor(private readonly machineService: WorkMachinesClientService) {}

  async getWorkMachines(user: User) {
    const data = await this.machineService.getWorkMachines(user)

    const value = data.value?.map(
      (v) =>
        ({
          ...v,
          ownerName: v.owner,
          supervisorName: v.supervisor,
        } as WorkMachine),
    ) as Array<WorkMachine>

    return {
      ...data,
      value,
    }
  }

  getWorkMachineById = (
    user: User,
    machineId: string,
    locale: string,
  ): Promise<WorkMachine | null> =>
    this.machineService.getWorkMachineById(user, machineId, locale)
}

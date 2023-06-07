import { WorkMachinesClientService } from '@island.is/clients/work-machines'
import { User } from '@island.is/auth-nest-tools'
import { WorkMachine } from './models/getWorkMachines'
import { Injectable } from '@nestjs/common'
import { WorkMachinesAction } from './api-domains-work-machines.types'
@Injectable()
export class WorkMachinesService {
  constructor(private readonly machineService: WorkMachinesClientService) {}

  private mapRelToAction = (rel?: string) => {
    switch (rel) {
      case 'requestInspection':
        return WorkMachinesAction.REQUEST_INSPECTION
      case 'changeStatus':
        return WorkMachinesAction.CHANGE_STATUS
      case 'ownerChange':
        return WorkMachinesAction.OWNER_CHANGE
      case 'supervisorChange':
        return WorkMachinesAction.SUPERVISOR_CHANGE
      case 'registerForTraffic':
        return WorkMachinesAction.REGISTER_FOR_TRAFFIC
      default:
        return null
    }
  }

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

  async getWorkMachineById(
    user: User,
    machineId: string,
    locale: string,
  ): Promise<WorkMachine | null> {
    const data = await this.machineService.getWorkMachineById(
      user,
      machineId,
      locale,
    )

    const links = data.links?.length
      ? data.links.map((l) => {
          return {
            ...l,
            rel: this.mapRelToAction(l.rel ?? ''),
          }
        })
      : null

    return {
      ...data,
      links,
    }
  }
}

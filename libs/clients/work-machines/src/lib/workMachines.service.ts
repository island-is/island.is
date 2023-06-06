import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  MachineHateoasDto,
  MachinesApi,
  MachinesFriendlyHateaosDto,
} from '../../gen/fetch'

@Injectable()
export class WorkMachinesClientService {
  constructor(private readonly machinesApi: MachinesApi) {}

  private apiWithAuth = (user: User) =>
    this.machinesApi.withMiddleware(new AuthMiddleware(user as Auth))

  getWorkMachines = (user: User): Promise<MachinesFriendlyHateaosDto> =>
    this.apiWithAuth(user).apiMachinesGet({})

  getWorkMachineById = (
    user: User,
    machineId: string,
    locale: string,
  ): Promise<MachineHateoasDto> =>
    this.apiWithAuth(user).getMachine({ id: machineId, locale })
}

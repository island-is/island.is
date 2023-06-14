import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  ApiMachinesGetRequest,
  GetMachineRequest,
  MachineHateoasDto,
  MachinesApi,
  MachinesFriendlyHateaosDto,
} from '../../gen/fetch'

@Injectable()
export class WorkMachinesClientService {
  constructor(private readonly machinesApi: MachinesApi) {}

  private apiWithAuth = (user: User) =>
    this.machinesApi.withMiddleware(new AuthMiddleware(user as Auth))

  getWorkMachines = (
    user: User,
    input: ApiMachinesGetRequest,
  ): Promise<MachinesFriendlyHateaosDto> =>
    this.apiWithAuth(user).apiMachinesGet(input)

  getWorkMachineById = (
    user: User,
    input: GetMachineRequest,
  ): Promise<MachineHateoasDto> => this.apiWithAuth(user).getMachine(input)
}

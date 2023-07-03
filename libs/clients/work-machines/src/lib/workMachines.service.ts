import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  ApiMachinesGetRequest,
  ExcelRequest,
  GetMachineRequest,
  MachineHateoasDto,
  MachinesApi,
  MachinesDocumentApi,
  MachinesFriendlyHateaosDto,
} from '../../gen/fetch'

@Injectable()
export class WorkMachinesClientService {
  constructor(
    private readonly machinesApi: MachinesApi,
    private readonly docApi: MachinesDocumentApi,
  ) {}

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

  getDocuments = (user: User, input: ExcelRequest): Promise<Blob> =>
    this.docApi.withMiddleware(new AuthMiddleware(user as Auth)).excel(input)
}

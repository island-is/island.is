import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  ApiMachinesGetRequest,
  ExcelRequest,
  GetMachineRequest,
  MachineCategoryApi,
  MachineFriendlyDto,
  MachineHateoasDto,
  MachineOwnerChangeApi,
  MachinesApi,
  MachinesDocumentApi,
  MachinesFriendlyHateaosDto,
} from '../../gen/fetch'
import { CustomMachineApi } from './providers'
import {
  MachineDto,
  ChangeMachineOwner,
  ConfirmOwnerChange,
} from './workMachines.types'
import {
  apiChangeMachineOwnerToApiRequest,
  confirmChangeToApiRequest,
} from './workMachines.utils'

@Injectable()
export class WorkMachinesClientService {
  constructor(
    private readonly machinesApi: MachinesApi,
    private readonly docApi: MachinesDocumentApi,
    private readonly machineApi: CustomMachineApi,
    private readonly machineOwnerChangeApi: MachineOwnerChangeApi,
    private readonly machineCategoryApi: MachineCategoryApi,
  ) {}

  private machinesApiWithAuth = (user: User) =>
    this.machinesApi.withMiddleware(new AuthMiddleware(user as Auth))

  private machineApiWithAuth(auth: Auth) {
    return this.machineApi.withMiddleware(new AuthMiddleware(auth))
  }

  private machineOwnerChangeApiWithAuth(auth: Auth) {
    return this.machineOwnerChangeApi.withMiddleware(new AuthMiddleware(auth))
  }

  private machineCategoryApiWithAuth(auth: Auth) {
    return this.machineCategoryApi.withMiddleware(new AuthMiddleware(auth))
  }
  getWorkMachines = (
    user: User,
    input: ApiMachinesGetRequest,
  ): Promise<MachinesFriendlyHateaosDto> =>
    this.machinesApiWithAuth(user).apiMachinesGet(input)

  getWorkMachineById = (
    user: User,
    input: GetMachineRequest,
  ): Promise<MachineHateoasDto> =>
    this.machinesApiWithAuth(user).getMachine(input)

  getDocuments = (user: User, input: ExcelRequest): Promise<Blob> =>
    this.docApi.withMiddleware(new AuthMiddleware(user as Auth)).excel(input)

  public async getMachines(auth: User): Promise<MachineFriendlyDto[]> {
    const result = await this.machinesApiWithAuth(auth).apiMachinesGet({
      onlyShowOwnedMachines: true,
    })
    return result?.value || []
  }

  public async getMachineDetail(auth: User, id: string): Promise<MachineDto> {
    const result = await this.machineApiWithAuth(auth).getMachine({
      id,
    })
    const [type, ...subType] = result.type?.split(' ') || ''
    return {
      id: result.id,
      ownerNumber: result?.ownerNumber || '',
      plate: result?.licensePlateNumber || '',
      subType: subType.join(' '),
      type: type,
      category: result?.category || '',
      regNumber: result?.registrationNumber || '',
      supervisorName: result?.supervisorName || '',
      status: result?.status || '',
      disabled: !result?.links?.some((link) => link?.rel === 'ownerChange'),
    }
  }

  public async isPaymentRequired(auth: Auth, regNumber: string) {
    const result = await this.machineCategoryApiWithAuth(
      auth,
    ).apiMachineCategoryGet({ registrationNumber: regNumber })

    return result.paymentRequiredForOwnerChange || false
  }

  public async initiateOwnerChangeProcess(
    auth: Auth,
    ownerChange: ChangeMachineOwner,
  ) {
    const input = apiChangeMachineOwnerToApiRequest(ownerChange)

    await this.machineOwnerChangeApiWithAuth(auth).apiMachineOwnerChangePost(
      input,
    )
  }

  public async confirmOwnerChange(
    auth: Auth,
    confirmChange: ConfirmOwnerChange,
  ) {
    const input = confirmChangeToApiRequest(
      confirmChange,
      auth.nationalId || '',
    )

    await this.machineOwnerChangeApiWithAuth(auth).apiMachineOwnerChangePut(
      input,
    )
  }
}

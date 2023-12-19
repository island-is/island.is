import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  ApiMachinesGetRequest,
  ExcelRequest,
  GetMachineRequest,
  MachineCategoryApi,
  MachineHateoasDto,
  MachineOwnerChangeApi,
  MachineSupervisorChangeApi,
  MachinesApi,
  MachinesDocumentApi,
  MachinesFriendlyHateaosDto,
} from '../../gen/fetch'
import {
  MachineDto,
  ChangeMachineOwner,
  ConfirmOwnerChange,
  ChangeMachineSupervisor,
} from './workMachines.types'
import {
  apiChangeMachineOwnerToApiRequest,
  apiChangeMachineSupervisorToApiRequest,
  confirmChangeToApiRequest,
} from './workMachines.utils'
import { CustomMachineApi } from './providers'

@Injectable()
export class WorkMachinesClientService {
  constructor(
    private readonly machinesApi: MachinesApi,
    private readonly machineApi: CustomMachineApi,
    private readonly docApi: MachinesDocumentApi,
    private readonly machineOwnerChangeApi: MachineOwnerChangeApi,
    private readonly machineCategoryApi: MachineCategoryApi,
    private readonly machineSupervisorChangeApi: MachineSupervisorChangeApi,
  ) {}

  private machinesApiWithAuth = (user: User) =>
    this.machinesApi.withMiddleware(new AuthMiddleware(user as Auth))

  private machineApiWithAuth = (user: User) =>
    this.machineApi.withMiddleware(new AuthMiddleware(user as Auth))

  private machineOwnerChangeApiWithAuth(auth: Auth) {
    return this.machineOwnerChangeApi.withMiddleware(new AuthMiddleware(auth))
  }

  private machineCategoryApiWithAuth(auth: Auth) {
    return this.machineCategoryApi.withMiddleware(new AuthMiddleware(auth))
  }

  private machineSupervisorChangeApiWithAuth(auth: Auth) {
    return this.machineSupervisorChangeApi.withMiddleware(
      new AuthMiddleware(auth),
    )
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

  async getMachines(auth: User): Promise<MachineDto[]> {
    const result = await this.machinesApiWithAuth(auth).apiMachinesGet({
      onlyShowOwnedMachines: true,
    })
    return (
      result?.value?.map((machine) => {
        return {
          id: machine.id,
          type: machine.type || '',
          category: machine?.category || '',
          regNumber: machine?.registrationNumber || '',
          status: machine?.status || '',
        }
      }) || []
    )
  }
  public async getMachineDetail(auth: User, id: string): Promise<MachineDto> {
    const result = await this.machineApiWithAuth(auth).getMachine({ id })
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

  public async changeMachineSupervisor(
    auth: Auth,
    ownerChange: ChangeMachineSupervisor,
  ) {
    const input = apiChangeMachineSupervisorToApiRequest(ownerChange)

    await this.machineSupervisorChangeApiWithAuth(
      auth,
    ).apiMachineSupervisorChangePost(input)
  }
}

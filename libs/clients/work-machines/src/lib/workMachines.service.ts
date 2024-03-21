import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  ApiMachineRequestInspectionPostRequest,
  ApiMachineStatusChangePostRequest,
  ApiMachinesGetRequest,
  ExcelRequest,
  GetMachineRequest,
  MachineCategoryApi,
  MachineHateoasDto,
  MachineInspectionRequestCreateDto,
  MachineOwnerChangeApi,
  MachineRequestInspectionApi,
  MachineStatusChangeApi,
  MachineStreetRegistrationApi,
  MachineStreetRegistrationCreateDto,
  MachineSupervisorChangeApi,
  MachinesApi,
  MachinesDocumentApi,
  MachinesFriendlyHateaosDto,
} from '../../gen/fetch'
import {
  MachineDto,
  ChangeMachineOwner,
  ConfirmOwnerChange,
  SupervisorChange,
  MachinesWithTotalCount,
} from './workMachines.types'
import {
  apiChangeMachineOwnerToApiRequest,
  apiChangeSupervisorToApiRequest,
  confirmChangeToApiRequest,
} from './workMachines.utils'
import { CustomMachineApi } from './providers'
import { handle404 } from '@island.is/clients/middlewares'

@Injectable()
export class WorkMachinesClientService {
  constructor(
    private readonly machinesApi: MachinesApi,
    private readonly machineApi: CustomMachineApi,
    private readonly docApi: MachinesDocumentApi,
    private readonly machineOwnerChangeApi: MachineOwnerChangeApi,
    private readonly machineCategoryApi: MachineCategoryApi,
    private readonly machineSupervisorChangeApi: MachineSupervisorChangeApi,
    private readonly machineStatusApi: MachineStatusChangeApi,
    private readonly machineStreetApi: MachineStreetRegistrationApi,
    private readonly machineRequestInspection: MachineRequestInspectionApi,
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

  private machineStatusApiWithAuth(auth: Auth) {
    return this.machineStatusApi.withMiddleware(new AuthMiddleware(auth))
  }

  private machineStreetApiWithAuth(auth: Auth) {
    return this.machineStreetApi.withMiddleware(new AuthMiddleware(auth))
  }

  private machineRequestInspectionApiWithAuth(auth: Auth) {
    return this.machineRequestInspection.withMiddleware(
      new AuthMiddleware(auth),
    )
  }

  getWorkMachines = async (
    user: User,
    input: ApiMachinesGetRequest,
  ): Promise<MachinesFriendlyHateaosDto | null> => {
    return await this.machinesApiWithAuth(user)
      .apiMachinesGet(input)
      .catch(handle404)
  }
  getWorkMachineById = async (
    user: User,
    input: GetMachineRequest,
  ): Promise<MachineHateoasDto | null> => {
    return await this.machineApiWithAuth(user)
      .getMachine(input)
      .catch(handle404)
  }
  getDocuments = (user: User, input: ExcelRequest): Promise<Blob> =>
    this.docApi.withMiddleware(new AuthMiddleware(user as Auth)).excel(input)

  async getMachines(auth: User): Promise<MachinesWithTotalCount> {
    const result = await this.machinesApiWithAuth(auth).apiMachinesGet({
      onlyShowOwnedMachines: true,
      pageSize: 20,
      pageNumber: 1,
    })
    console.log('result', result)
    return {
      machines:
        result?.value?.map((machine) => {
          return {
            id: machine.id,
            type: machine.type || '',
            category: machine?.category || '',
            regNumber: machine?.registrationNumber || '',
            status: machine?.status || '',
          }
        }) || [],
      totalCount: result?.pagination?.totalCount || 0,
    }
  }

  async getMachineByRegno(
    auth: User,
    regNumber: string,
    rel: string,
  ): Promise<MachineDto> {
    const result = await this.machinesApiWithAuth(auth).apiMachinesGet({
      onlyShowOwnedMachines: true,
      searchQuery: regNumber,
    })

    return await this.getMachineDetail(auth, result?.value?.[0]?.id || '', rel)
  }

  async getMachineDetail(
    auth: User,
    id: string,
    rel: string,
  ): Promise<MachineDto> {
    const result = await this.machineApiWithAuth(auth).getMachine({ id })
    console.log('details result', result)
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
      disabled: !result?.links?.some((link) => link?.rel === rel),
    }
  }

  async isPaymentRequired(auth: Auth, regNumber: string) {
    const result = await this.machineCategoryApiWithAuth(
      auth,
    ).apiMachineCategoryGet({ registrationNumber: regNumber })

    return result.paymentRequiredForOwnerChange || false
  }

  async initiateOwnerChangeProcess(
    auth: Auth,
    ownerChange: ChangeMachineOwner,
  ) {
    const input = apiChangeMachineOwnerToApiRequest(ownerChange)

    await this.machineOwnerChangeApiWithAuth(auth).apiMachineOwnerChangePost(
      input,
    )
  }

  async confirmOwnerChange(auth: Auth, confirmChange: ConfirmOwnerChange) {
    const input = confirmChangeToApiRequest(
      confirmChange,
      auth.nationalId || '',
    )

    await this.machineOwnerChangeApiWithAuth(auth).apiMachineOwnerChangePut(
      input,
    )
  }

  async changeMachineSupervisor(
    auth: Auth,
    supervisorChange: SupervisorChange,
  ) {
    const input = apiChangeSupervisorToApiRequest(supervisorChange)
    await this.machineSupervisorChangeApiWithAuth(
      auth,
    ).apiMachineSupervisorChangePost(input)
  }

  async deregisterMachine(
    auth: Auth,
    deregisterMachine: ApiMachineStatusChangePostRequest,
  ) {
    await this.machineStatusApiWithAuth(auth).apiMachineStatusChangePost(
      deregisterMachine,
    )
  }

  async streetRegistration(
    auth: Auth,
    streetRegistration: MachineStreetRegistrationCreateDto,
  ) {
    await this.machineStreetApiWithAuth(auth).apiMachineStreetRegistrationPost({
      machineStreetRegistrationCreateDto: streetRegistration,
    })
  }

  async requestInspection(
    auth: Auth,
    requestInspection: MachineInspectionRequestCreateDto,
  ) {
    await this.machineRequestInspectionApiWithAuth(
      auth,
    ).apiMachineRequestInspectionPost({
      machineInspectionRequestCreateDto: requestInspection,
    })
  }
}

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  MachineCategoryApi,
  MachineOwnerChangeApi,
  MachineSupervisorChangeApi,
  MachinesApi,
} from '../../gen/fetch/apis'
import {
  ChangeMachineOwner,
  ChangeMachineSupervisor,
  ConfirmOwnerChange,
  Machine,
  MachineDetails,
} from './transferOfMachineOwnershipClient.types'
import { CustomMachineApi } from './customMachineApi'
import {
  apiChangeMachineOwnerToApiRequest,
  apiChangeMachineSupervisorToApiRequest,
  confirmChangeToApiRequest,
} from './transferOfMachineOwnershipClient.utils'

@Injectable()
export class TransferOfMachineOwnershipClient {
  constructor(
    private readonly machinesApi: MachinesApi,
    private readonly machineApi: CustomMachineApi,
    private readonly machineOwnerChangeApi: MachineOwnerChangeApi,
    private readonly machineSupervisorChangeApi: MachineSupervisorChangeApi,
    private readonly machineCategoryApi: MachineCategoryApi,
  ) {}

  private machinesApiWithAuth(auth: Auth) {
    return this.machinesApi.withMiddleware(new AuthMiddleware(auth))
  }

  private machineApiWithAuth(auth: Auth) {
    return this.machineApi.withMiddleware(new AuthMiddleware(auth))
  }

  private machineOwnerChangeApiWithAuth(auth: Auth) {
    return this.machineOwnerChangeApi.withMiddleware(new AuthMiddleware(auth))
  }

  private machineSupervisorChangeApiWithAuth(auth: Auth) {
    return this.machineSupervisorChangeApi.withMiddleware(
      new AuthMiddleware(auth),
    )
  }

  private machineCategoryApiWithAuth(auth: Auth) {
    return this.machineCategoryApi.withMiddleware(new AuthMiddleware(auth))
  }

  public async getMachines(auth: User): Promise<Machine[]> {
    console.log('Start fetching machines...')
    try {
      const result = await this.machinesApiWithAuth(auth).apiMachinesGet({
        // searchQuery: undefined,
        // pageNumber: undefined,
        // pageSize: undefined,
        // orderBy: undefined,
        // showDeregisteredMachines: undefined,
        // supervisorRegistered: undefined,
        // onlyInOwnerChangeProcess: undefined,
        onlyShowOwnedMachines: true,
        // locale: 'is',
      })

      if (result.value) {
        const machines: Machine[] = result.value.map((m) => ({
          id: m.id,
          registrationNumber: m.registrationNumber || null,
          type: m.type || null,
          owner: m.owner || null,
          supervisor: m.supervisor || null,
          status: m.status || null,
          dateLastInspection: m.dateLastInspection || null,
          category: m.category || null,
          subCategory: m.subCategory || null,
          _links: result.links || null,
        }))

        console.log('Machines fetched successfully')
        return machines
      } else {
        console.error('Response value is empty or undefined')
        throw new Error('Empty response from the server')
      }
    } catch (error) {
      console.error('Error fetching machines:', error)

      // You can handle different types of errors here, or re-throw them if needed
      throw error
    }
  }

  public async getMachineDetail(
    auth: User,
    id: string,
  ): Promise<MachineDetails> {
    const result = await this.machineApiWithAuth(auth).getMachine({
      id,
      // locale: 'is',
    })

    const machine: MachineDetails = {
      id: result.id,
      registrationNumber: result.registrationNumber || null,
      type: result.type || null,
      status: result.status || null,
      category: result.category || null,
      subCategory: result.subCategory || null,
      productionYear: result.productionYear || null,
      registrationDate: result.registrationDate || null,
      ownerNumber: result.ownerNumber || null,
      productionNumber: result.productionNumber || null,
      productionCountry: result.productionCountry || null,
      licensePlateNumber: result.licensePlateNumber || null,
      importer: result.importer || null,
      insurer: result.insurer || null,
      ownerName: result.ownerName || null,
      ownerNationalId: result.ownerNationalId || null,
      ownerAddress: result.ownerAddress || null,
      ownerPostcode: result.ownerPostcode || null,
      supervisorName: result.supervisorName || null,
      supervisorNationalId: result.supervisorNationalId || null,
      supervisorAddress: result.supervisorAddress || null,
      supervisorPostcode: result.supervisorPostcode || null,
      _links: result.links || null,
    }

    return machine
  }

  public async isPaymentRequired(auth: Auth, regNumber: string) {
    const result = await this.machineCategoryApiWithAuth(
      auth,
    ).apiMachineCategoryGet({ registrationNumber: regNumber })

    return result.paymentRequiredForOwnerChange
  }

  public async changeMachineOwner(auth: Auth, ownerChange: ChangeMachineOwner) {
    const input = apiChangeMachineOwnerToApiRequest(ownerChange)

    await this.machineOwnerChangeApiWithAuth(auth).apiMachineOwnerChangePost(
      input,
    )
  }

  public async conformOwnerChange(
    auth: Auth,
    confirmChange: ConfirmOwnerChange,
  ) {
    const input = confirmChangeToApiRequest(confirmChange)

    await this.machineOwnerChangeApiWithAuth(auth).apiMachineOwnerChangePut(
      input,
    )
  }

  public async changeMachineSupervisor(
    auth: Auth,
    supervisorChange: ChangeMachineSupervisor,
  ) {
    const input = apiChangeMachineSupervisorToApiRequest(supervisorChange)

    await this.machineSupervisorChangeApiWithAuth(
      auth,
    ).apiMachineSupervisorChangePost(input)
  }
}

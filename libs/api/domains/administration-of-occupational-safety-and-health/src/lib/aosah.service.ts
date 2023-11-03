import { User } from '@island.is/auth-nest-tools'
import {
  TransferOfMachineOwnershipClientModule,
  TransferOfMachineOwnershipClient,
  MachineDetails,
} from '@island.is/clients/aosah/transfer-of-machine-ownership'
import { Injectable } from '@nestjs/common'
import { ChangeMachineOwner } from './graphql/ownerChange.input'
import { ConfirmOwnerChange } from './graphql/confirmOwnerChange.input'
import { ChangeMachineSupervisor } from './graphql/changeMachineSupervisor.input'

@Injectable()
export class AosahApi {
  constructor(
    //private readonly machinesApi: MachinesApi,
    private readonly transferOfMachineOwnershipClient: TransferOfMachineOwnershipClient,
  ) {}

  async getMachineDetails(auth: User, id: string): Promise<MachineDetails> {
    const result = await this.transferOfMachineOwnershipClient.getMachineDetail(
      auth,
      id,
    )

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
      _links: result._links || null,
    }

    return machine
  }

  async changeMachineOwner(
    auth: User,
    changeOwner: ChangeMachineOwner,
  ): Promise<void> {
    await this.transferOfMachineOwnershipClient.changeMachineOwner(
      auth,
      changeOwner,
    )
  }

  async confirmOwnerChange(
    auth: User,
    confirmChange: ConfirmOwnerChange,
  ): Promise<void> {
    await this.transferOfMachineOwnershipClient.conformOwnerChange(
      auth,
      confirmChange,
    )
  }

  async changeMachineSupervisor(
    auth: User,
    changeSupervisor: ChangeMachineSupervisor,
  ): Promise<void> {
    await this.transferOfMachineOwnershipClient.changeMachineSupervisor(
      auth,
      changeSupervisor,
    )
  }

  async isPaymentRequired(auth: User, regNumber: string): Promise<boolean> {
    return (
      (await this.transferOfMachineOwnershipClient.isPaymentRequired(
        auth,
        regNumber,
      )) || false
    )
  }
}

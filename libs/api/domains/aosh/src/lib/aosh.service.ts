import { User } from '@island.is/auth-nest-tools'

import { Injectable } from '@nestjs/common'
import { ChangeMachineOwner } from './graphql/ownerChange.input'
import { ConfirmOwnerChange } from './graphql/confirmOwnerChange.input'
import { TransferOfMachineOwnershipClient } from '@island.is/clients/aosh/transfer-of-machine-ownership'
import { MachineHateoasDto } from '@island.is/clients/aosh/transfer-of-machine-ownership'

@Injectable()
export class AoshApi {
  constructor(
    private readonly transferOfMachineOwnershipClient: TransferOfMachineOwnershipClient,
  ) {}

  async getMachineDetails(auth: User, id: string): Promise<MachineHateoasDto> {
    return await this.transferOfMachineOwnershipClient.getMachineDetail(
      auth,
      id,
    )
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
    await this.transferOfMachineOwnershipClient.confirmOwnerChange(
      auth,
      confirmChange,
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

import { User } from '@island.is/auth-nest-tools'

import { Injectable } from '@nestjs/common'
import {
  MachineDto,
  TransferOfMachineOwnershipClient,
} from '@island.is/clients/aosh/transfer-of-machine-ownership'

@Injectable()
export class AoshApi {
  constructor(
    private readonly transferOfMachineOwnershipClient: TransferOfMachineOwnershipClient,
  ) {}

  async getMachineDetails(auth: User, id: string): Promise<MachineDto> {
    return this.transferOfMachineOwnershipClient.getMachineDetail(auth, id)
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

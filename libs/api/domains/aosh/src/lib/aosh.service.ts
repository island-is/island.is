import { User } from '@island.is/auth-nest-tools'

import { Injectable } from '@nestjs/common'
import { TransferOfMachineOwnershipClient } from '@island.is/clients/aosh/transfer-of-machine-ownership'
import { MachineHateoasDto } from '@island.is/clients/aosh/transfer-of-machine-ownership'

@Injectable()
export class AoshApi {
  constructor(
    private readonly transferOfMachineOwnershipClient: TransferOfMachineOwnershipClient,
  ) {}

  async getMachineDetails(auth: User, id: string): Promise<MachineHateoasDto> {
    return this.transferOfMachineOwnershipClient.getMachineDetail(auth, id)
  }

  async isPaymentRequired(
    auth: User,
    regNumber: string,
  ): Promise<boolean | undefined> {
    return (
      this.transferOfMachineOwnershipClient.isPaymentRequired(
        auth,
        regNumber,
      ) || false
    )
  }
}

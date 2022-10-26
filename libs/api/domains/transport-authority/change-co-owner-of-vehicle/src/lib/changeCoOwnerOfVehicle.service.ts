import { Injectable } from '@nestjs/common'
import {
  OwnerChangeCoOwner,
  VehicleOwnerChangeClient,
} from '@island.is/clients/transport-authority/vehicle-owner-change'
import { VehicleOperatorsClient } from '@island.is/clients/transport-authority/vehicle-operators'

@Injectable()
export class ChangeCoOwnerOfVehicleApi {
  constructor(
    private readonly vehicleOwnerChangeClient: VehicleOwnerChangeClient,
    private readonly vehicleOperatorsClient: VehicleOperatorsClient,
  ) {}

  async saveCoOwners(
    currentUserSsn: string,
    permno: string,
    ownerEmail: string,
    newCoOwners: OwnerChangeCoOwner[],
  ): Promise<void> {
    const currentOwnerChange = await this.vehicleOwnerChangeClient.getNewestOwnerChange(
      permno,
    )

    const currentOperators = await this.vehicleOperatorsClient.getOperators(
      permno,
    )

    await this.vehicleOwnerChangeClient.saveOwnerChange(currentUserSsn, {
      permno: currentOwnerChange?.permno,
      seller: {
        ssn: currentOwnerChange?.ownerSsn,
        email: ownerEmail,
      },
      buyer: {
        ssn: currentOwnerChange?.ownerSsn,
        email: ownerEmail,
      },
      dateOfPurchase: currentOwnerChange?.dateOfPurchase,
      saleAmount: currentOwnerChange?.saleAmount,
      insuranceCompanyCode: currentOwnerChange?.insuranceCompanyCode,
      operators: currentOperators?.map((operator) => ({
        ssn: operator.ssn || '',
        email: 'xxx', //TODOx missing operators email or should send in empty array
        isMainOperator: operator.isMainOperator || false,
      })),
      coOwners: newCoOwners,
    })
  }
}

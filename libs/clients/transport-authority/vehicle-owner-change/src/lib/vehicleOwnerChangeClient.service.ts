import { Injectable } from '@nestjs/common'
import { OwnerChangeApi } from '../../gen/fetch/apis'
import { OwnerChange } from './vehicleOwnerChangeClient.types'

@Injectable()
export class VehicleOwnerChangeClient {
  constructor(private readonly ownerchangeApi: OwnerChangeApi) {}

  public async saveOwnerChange(
    currentUserSsn: string,
    ownerChange: OwnerChange,
  ): Promise<void> {
    // TODOx disabled untill this API goes on xroad
    throw Error('Not implemented')
    return

    const result = await this.ownerchangeApi.rootPost({
      postOwnerChange: {
        permno: ownerChange.permno,
        sellerPersonIdNumber: ownerChange.seller.ssn,
        sellerEmail: ownerChange.seller.email,
        buyerPersonIdNumber: ownerChange.buyer.ssn,
        buyerEmail: ownerChange.buyer.email,
        dateOfPurchase: ownerChange.dateOfPurchase,
        saleAmount: ownerChange.saleAmount,
        insuranceCompanyCode: ownerChange.insuranceCompanyCode,
        useGroup: '000',
        operatorEmail: ownerChange.operators?.find((x) => x.isMainOperator)
          ?.email,
        operators: ownerChange.operators?.map((operator) => ({
          personIdNumber: operator.ssn,
          mainOperator: operator.isMainOperator ? 1 : 0,
        })),
        coOwners: ownerChange.coOwners?.map((coOwner) => ({
          personIdNumber: coOwner.ssn,
        })),
        reportingPersonIdNumber: currentUserSsn,
      },
    })
  }
}

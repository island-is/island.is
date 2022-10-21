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
    const result = await this.ownerchangeApi.rootPost({
      postOwnerChange: {
        permno: ownerChange.permno,
        sellerPersonIdNumber: ownerChange.sellerSsn,
        sellerEmail: ownerChange.sellerEmail,
        buyerPersonIdNumber: ownerChange.buyerSsn,
        buyerEmail: ownerChange.buyerEmail,
        dateOfPurchase: ownerChange.dateOfPurchase,
        saleAmount: ownerChange.saleAmount,
        insuranceCompanyCode: ownerChange.insuranceCompanyCode,
        useGroup: ownerChange.useGroup,
        //operatorEmail: xx, //TODOx afhverju þarf þetta, ætti ekki að vera inní operators array, eða á bara við um main?
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

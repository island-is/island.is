import { Injectable } from '@nestjs/common'
import { OwnerChangeApi } from '../../gen/fetch/apis'
import { OwnerChange } from './vehicleOwnerChangeClient.types'

@Injectable()
export class VehicleOwnerChangeClient {
  constructor(private readonly ownerchangeApi: OwnerChangeApi) {}

  public async getNewestOwnerChange(permno: string): Promise<OwnerChange> {
    const result = await this.ownerchangeApi.getOwnerChange({
      permno: permno,
    })

    return {
      permno: permno,
      seller: {
        ssn: result?.persidno || '',
        name: result?.ownerName,
        email: '',
      },
      buyer: {
        ssn: result?.persidno || '',
        name: result?.ownerName,
        email: '',
      },
      dateOfPurchase: result?.dateOfOwnerRegistration || new Date(),
      saleAmount: result?.saleAmount || 0,
      insuranceCompanyCode: result?.insuranceCompanyCode || '',
      insuranceCompanyName: result?.insuranceCompanyName,
      operators: [], //TODOx sækja úr operators vefþjónustu
      coOwners: result?.coOwners?.map((coOwner) => ({
        ssn: coOwner.coOwnerPersidno || '',
        name: coOwner.coOwnerName,
        email: '',
      })),
    }
  }

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

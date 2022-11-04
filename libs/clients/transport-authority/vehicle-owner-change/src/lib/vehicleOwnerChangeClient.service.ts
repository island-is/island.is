import { Injectable } from '@nestjs/common'
import { OwnerChangeApi } from '../../gen/fetch/apis'
import {
  NewestOwnerChange,
  OwnerChange,
} from './vehicleOwnerChangeClient.types'

@Injectable()
export class VehicleOwnerChangeClient {
  constructor(private readonly ownerchangeApi: OwnerChangeApi) {}

  public async getNewestOwnerChange(
    permno: string,
  ): Promise<NewestOwnerChange> {
    const result = await this.ownerchangeApi.getOwnerChange({
      apiVersion: '2.0',
      apiVersion2: '2.0',
      permno: permno,
    })

    return {
      permno: permno,
      ownerSsn: result?.persidno || '',
      ownerName: result?.persidno || '',
      dateOfPurchase: result?.dateOfOwnerRegistration || new Date(),
      saleAmount: result?.saleAmount || 0,
      insuranceCompanyCode: result?.insuranceCompanyCode || '',
      insuranceCompanyName: result?.insuranceCompanyName,
    }
  }

  public async saveOwnerChange(
    currentUserSsn: string,
    ownerChange: OwnerChange,
  ): Promise<void> {
    const result = await this.ownerchangeApi.rootPost({
      apiVersion: '2.0',
      apiVersion2: '2.0',
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

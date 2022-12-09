import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { OwnerChangeApi } from '../../gen/fetch/apis'
import {
  NewestOwnerChange,
  OwnerChange,
} from './vehicleOwnerChangeClient.types'

@Injectable()
export class VehicleOwnerChangeClient {
  constructor(private readonly ownerchangeApi: OwnerChangeApi) {}

  private ownerchangeApiWithAuth(auth: Auth) {
    return this.ownerchangeApi.withMiddleware(new AuthMiddleware(auth))
  }

  public async getNewestOwnerChange(
    auth: User,
    permno: string,
  ): Promise<NewestOwnerChange> {
    const result = await this.ownerchangeApiWithAuth(auth).getOwnerChange({
      apiVersion: '2.0',
      apiVersion2: '2.0',
      permno: permno,
    })

    return {
      permno: permno,
      ownerSsn: result?.persidno || '',
      ownerName: result?.ownerName || '',
      dateOfPurchase: result?.dateOfOwnerRegistration || new Date(),
      saleAmount: result?.saleAmount || 0,
      insuranceCompanyCode: result?.insuranceCompanyCode || '',
      insuranceCompanyName: result?.insuranceCompanyName,
    }
  }

  // Note: auth.nationalId might not be the same as ownerChange.seller.ssn, but when calling this
  // function, we should be sure that the seller (ownerChange.seller.ssn) is the one that created
  // the application and is the only one that has changed the fields: permno, seller and buyer
  public async saveOwnerChange(
    auth: User,
    ownerChange: OwnerChange,
  ): Promise<void> {
    await this.ownerchangeApiWithAuth(auth).rootPost({
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
        reportingPersonIdNumber: auth.nationalId,
      },
    })
  }
}

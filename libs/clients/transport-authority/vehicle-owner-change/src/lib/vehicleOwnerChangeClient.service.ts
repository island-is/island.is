import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { ReturnTypeMessage } from '../../gen/fetch'
import { OwnerChangeApi } from '../../gen/fetch/apis'
import {
  NewestOwnerChange,
  OwnerChange,
  OwnerChangeValidation,
} from './vehicleOwnerChangeClient.types'
import { getDateAtTimestamp } from './vehicleOwnerChangeClient.utils'

@Injectable()
export class VehicleOwnerChangeClient {
  constructor(private readonly ownerchangeApi: OwnerChangeApi) {}

  private ownerchangeApiWithAuth(auth: Auth) {
    return this.ownerchangeApi.withMiddleware(new AuthMiddleware(auth))
  }

  public async validateVehicleForOwnerChange(
    auth: User,
    permno: string,
  ): Promise<OwnerChangeValidation> {
    // Note: since the vehiclecheck endpoint is funky, we will instead just use the personcheck endpoint
    // and send in dummy data where needed
    const todayStr = new Date().toISOString()
    return await this.validateAllForOwnerChange(auth, {
      permno: permno,
      seller: {
        ssn: auth.nationalId,
        email: 'mockEmail@island.is',
      },
      buyer: {
        ssn: auth.nationalId,
        email: 'mockEmail@island.is',
      },
      dateOfPurchase: new Date(),
      dateOfPurchaseTimestamp: todayStr.substring(11, todayStr.length),
      saleAmount: 0,
      insuranceCompanyCode: null,
      operators: null,
      coOwners: null,
    })
  }

  public async validateAllForOwnerChange(
    auth: User,
    ownerChange: OwnerChange,
  ): Promise<OwnerChangeValidation> {
    const useGroup = '000'

    let errorList: ReturnTypeMessage[] | undefined

    try {
      // Note: If insurance company has not been supplied (we have not required the user to fill in at this point),
      // then we will just send in a dummy value
      let insuranceCompanyCode = ownerChange.insuranceCompanyCode
      if (!insuranceCompanyCode) {
        const dummyInsuranceCompanyCode = '6090' // VÍS
        insuranceCompanyCode = dummyInsuranceCompanyCode
      }

      // Note: API throws error if timestamp is 00:00:00, so we will use
      // timestamp when application was created
      const purchaseDate = getDateAtTimestamp(
        ownerChange.dateOfPurchase,
        ownerChange.dateOfPurchaseTimestamp,
      )

      // Note: we have manually changed this endpoint to void, since the messages we want only
      // come with error code 400. If this function returns an array of ReturnTypeMessage, then
      // we will get an error with code 204, since the openapi generator tries to convert empty result
      // into an array of ReturnTypeMessage
      await this.ownerchangeApiWithAuth(auth).personcheckPost({
        apiVersion: '2.0',
        apiVersion2: '2.0',
        postPersonOwnerChange: {
          permno: ownerChange.permno,
          currentOwnerPersonIdNumber: ownerChange.seller.ssn,
          sellerEmail: ownerChange.seller.email,
          personIdNumber: ownerChange.buyer.ssn,
          buyerEmail: ownerChange.buyer.email,
          purchaseDate: purchaseDate,
          saleAmount: ownerChange.saleAmount,
          insuranceCompanyCode: insuranceCompanyCode,
          useGroup: useGroup,
          operatorEmail: null,
          operators: null,
          coOwners: null,
          reportingPersonIdNumber: auth.nationalId,
          mileage: ownerChange.mileage,
        },
      })
    } catch (e) {
      // Note: We need to wrap in try-catch to get the error messages, because if this action results in error,
      // we get 4xx error (instead of 200 with error messages) with the errorList in this field
      // ("body.Errors" for input validation, and "body" for data validation (in database)),
      // that is of the same class as 200 result schema
      if (e?.body?.Errors && Array.isArray(e.body.Errors)) {
        errorList = e.body.Errors as ReturnTypeMessage[]
      } else if (e?.body && Array.isArray(e.body)) {
        errorList = e.body as ReturnTypeMessage[]
      } else {
        throw e
      }
    }

    const warnSeverityError = 'E'
    const warnSeverityLock = 'L'
    errorList = errorList?.filter(
      (x) =>
        x.errorMess &&
        (x.warnSever === warnSeverityError || x.warnSever === warnSeverityLock),
    )

    return {
      hasError: !!errorList?.length,
      errorMessages: errorList?.map((item) => {
        let errorNo = item.warningSerialNumber?.toString()

        // Note: For vehicle locks, we need to do some special parsing since
        // the error number (warningSerialNumber) is always -1 for locks,
        // but the number is included in the errorMess field (value before the first space)
        if (item.warnSever === warnSeverityLock) {
          errorNo = item.errorMess?.split(' ')[0]
        }

        return {
          errorNo: (item.warnSever || '_') + errorNo,
          defaultMessage: item.errorMess,
        }
      }),
    }
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
    const useGroup = '000'

    // Note: API throws error if timestamp is 00:00:00, so we will use
    // timestamp when application was created
    const purchaseDate = getDateAtTimestamp(
      ownerChange.dateOfPurchase,
      ownerChange.dateOfPurchaseTimestamp,
    )

    await this.ownerchangeApiWithAuth(auth).rootPost({
      apiVersion: '2.0',
      apiVersion2: '2.0',
      postOwnerChange: {
        permno: ownerChange.permno,
        sellerPersonIdNumber: ownerChange.seller.ssn,
        sellerEmail: ownerChange.seller.email,
        buyerPersonIdNumber: ownerChange.buyer.ssn,
        buyerEmail: ownerChange.buyer.email,
        dateOfPurchase: purchaseDate,
        saleAmount: ownerChange.saleAmount,
        insuranceCompanyCode: ownerChange.insuranceCompanyCode || '',
        useGroup: useGroup,
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
        mileage: ownerChange.mileage,
      },
    })
  }
}

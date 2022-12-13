import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { lookup } from 'dns'
import { ReturnTypeMessage } from '../../gen/fetch'
import { OwnerChangeApi } from '../../gen/fetch/apis'
import {
  NewestOwnerChange,
  OwnerChange,
  OwnerChangeValidation,
} from './vehicleOwnerChangeClient.types'
import { getDateAtNoon } from './vehicleOwnerChangeClient.utils'

@Injectable()
export class VehicleOwnerChangeClient {
  constructor(private readonly ownerchangeApi: OwnerChangeApi) {}

  private ownerchangeApiWithAuth(auth: Auth) {
    return this.ownerchangeApi.withMiddleware(new AuthMiddleware(auth))
  }

  public async validateVehicleForOwnerChange(
    auth: User,
    permno: string,
    dateOfPurchase: Date,
  ): Promise<OwnerChangeValidation> {
    const useGroup = '000'

    let errorList: ReturnTypeMessage[] = []

    try {
      // Note: we have manually changed this endpoint to void, since the messages we want only
      // come with error code 400. If this function returns an array of ReturnTypeMessage, then
      // we will get an error with code 204, since the openapi generator tries to convert empty result
      // into an array of ReturnTypeMessage
      //TODOx removed while not working correctly
      // await this.ownerchangeApiWithAuth(auth).vehiclecheckPost({
      //   apiVersion: '2.0',
      //   apiVersion2: '2.0',
      //   postVehicleOwnerChange: {
      //     permno: permno,
      //     dateOfPurchase: dateOfPurchase,
      //     useGroup: useGroup,
      //   },
      // })
    } catch (e) {
      // Note: We need to wrap in try-catch to get the error messages, becuase if ownerchange results in error,
      // we get 400 error (instead of 200 with error messages) with the errorList in this field (problem.Errors),
      // that is of the same class as 200 result schema
      if (e?.problem?.Errors) {
        errorList = e.problem.Errors as ReturnTypeMessage[]
      } else {
        throw e
      }
    }

    const warnSeverityError = 'E'
    errorList = errorList.filter((x) => x.warnSever === warnSeverityError)

    return {
      hasError: errorList.length > 0,
      errorMessages: errorList.map((item) => ({
        errorNo: -1, // TODOx // item.errorNo,
        defaultMessage: item.errorMess,
      })),
    }
  }

  public async validateAllForOwnerChange(
    auth: User,
    ownerChange: OwnerChange,
  ): Promise<OwnerChangeValidation> {
    const useGroup = '000'

    let errorList: ReturnTypeMessage[] = []

    try {
      // Note: If insurance company has not been supplied (we have not required the user to fill in at this point),
      // then we will just send in a dummy value
      let insuranceCompanyCode = ownerChange.insuranceCompanyCode
      if (!insuranceCompanyCode) {
        const dummyInsuranceCompanyCode = '6090' // VÍS
        insuranceCompanyCode = dummyInsuranceCompanyCode
      }

      const purchaseDate = getDateAtNoon(ownerChange.dateOfPurchase)

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
        },
      })
    } catch (e) {
      // Note: We need to wrap in try-catch to get the error messages, becuase if ownerchange results in error,
      // we get 400 error (instead of 200 with error messages) with the errorList in this field (problem.Errors),
      // that is of the same class as 200 result schema
      if (e?.problem?.Errors) {
        errorList = e.problem.Errors as ReturnTypeMessage[]
      } else {
        throw e
      }
    }

    const warnSeverityError = 'E'
    errorList = errorList.filter((x) => x.warnSever === warnSeverityError)

    return {
      hasError: errorList.length > 0,
      errorMessages: errorList.map((item) => ({
        errorNo: -1, // TODOx // item.errorNo,
        defaultMessage: item.errorMess,
      })),
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

    const purchaseDate = getDateAtNoon(ownerChange.dateOfPurchase)

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
        insuranceCompanyCode: ownerChange.insuranceCompanyCode,
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
      },
    })
  }
}

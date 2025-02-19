import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { OwnerChangeApi } from '../../gen/fetch/apis'
import {
  NewestOwnerChange,
  OwnerChange,
  OwnerChangeValidation,
} from './vehicleOwnerChangeClient.types'
import {
  ErrorMessage,
  getCleanErrorMessagesFromTryCatch,
  getDateAtTimestamp,
} from './vehicleOwnerChangeClient.utils'
import { MileageReadingApi } from '@island.is/clients/vehicles-mileage'
import { logger } from '@island.is/logging'

@Injectable()
export class VehicleOwnerChangeClient {
  constructor(
    private readonly ownerchangeApi: OwnerChangeApi,
    private readonly mileageReadingApi: MileageReadingApi,
  ) {}

  private ownerchangeApiWithAuth(auth: Auth) {
    return this.ownerchangeApi.withMiddleware(new AuthMiddleware(auth))
  }

  private mileageReadingApiWithAuth(auth: Auth) {
    return this.mileageReadingApi.withMiddleware(new AuthMiddleware(auth))
  }

  public async validateVehicleForOwnerChange(
    auth: User,
    permno: string,
  ): Promise<OwnerChangeValidation> {
    // Note: since the vehiclecheck endpoint is funky, we will instead just use the personcheck endpoint
    // and send in dummy data where needed

    const todayStr = new Date().toISOString()

    // Get current mileage reading
    let currentMileage = 0
    try {
      const mileageReadings = await this.mileageReadingApiWithAuth(
        auth,
      ).getMileageReading({ permno })
      currentMileage = mileageReadings?.[0]?.mileage || 0
    } catch (e) {
      logger.error(e)
      return {
        hasError: true,
        errorMessages: [{ defaultMessage: e.message }],
      }
    }

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
      mileage: currentMileage + 1,
    })
  }

  public async validateAllForOwnerChange(
    auth: User,
    ownerChange: OwnerChange,
  ): Promise<OwnerChangeValidation> {
    const useGroup = '000'

    let errorMessages: ErrorMessage[] | undefined

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

      // Note: we have manually changed this endpoint to void (in clientConfig), since the messages we want only
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
          operatorEmail:
            ownerChange.operators?.find((x) => x.isMainOperator)?.email || null,
          operators:
            ownerChange.operators?.map((operator) => ({
              personIdNumber: operator.ssn,
              mainOperator: operator.isMainOperator ? 1 : 0,
            })) || null,
          coOwners:
            ownerChange.coOwners?.map((coOwner) => ({
              personIdNumber: coOwner.ssn,
            })) || null,
          reportingPersonIdNumber: auth.nationalId,
          mileage: ownerChange.mileage,
        },
      })
    } catch (e) {
      // Note: We had to wrap in try-catch to get the error messages, because if this action results in error,
      // we get 4xx error (instead of 200 with error messages) with the error messages in the body
      errorMessages = getCleanErrorMessagesFromTryCatch(e)
    }

    return {
      hasError: !!errorMessages?.length,
      errorMessages: errorMessages,
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
  ): Promise<OwnerChangeValidation> {
    const useGroup = '000'

    // Note: API throws error if timestamp is 00:00:00, so we will use
    // timestamp when application was created
    const purchaseDate = getDateAtTimestamp(
      ownerChange.dateOfPurchase,
      ownerChange.dateOfPurchaseTimestamp,
    )

    let errorMessages: ErrorMessage[] | undefined

    try {
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
    } catch (e) {
      errorMessages = getCleanErrorMessagesFromTryCatch(e)
    }

    return {
      hasError: !!errorMessages?.length,
      errorMessages: errorMessages,
    }
  }
}

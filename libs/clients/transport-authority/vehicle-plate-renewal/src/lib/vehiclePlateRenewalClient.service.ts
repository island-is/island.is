import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { PlateOwnershipApi } from '../../gen/fetch/apis'
import {
  PlateOwnership,
  PlateOwnershipValidation,
} from './vehiclePlateRenewalClient.types'
import { PlateOwnershipApiWithoutIdsAuth } from './apiConfiguration'
import {
  getCleanMessagesFromTryCatch,
  ValidationMessage,
} from '@island.is/clients/transport-authority/vehicle-owner-change'

@Injectable()
export class VehiclePlateRenewalClient {
  constructor(
    private readonly plateOwnershipApi: PlateOwnershipApi,
    private readonly plateOwnershipApiWithoutIdsAuth: PlateOwnershipApiWithoutIdsAuth,
  ) {}

  private plateOwnershipApiWithAuth(auth: Auth) {
    return this.plateOwnershipApi.withMiddleware(new AuthMiddleware(auth))
  }

  public async getMyPlateOwnerships(
    auth: User,
  ): Promise<Array<PlateOwnership>> {
    const result = await this.plateOwnershipApiWithAuth(auth).plateownershipGet(
      {
        apiVersion: '1.0',
        apiVersion2: '1.0',
        persidno: auth.nationalId,
        showExpired: false,
      },
    )

    return result.map((item) => ({
      regno: item.regno || '',
      startDate: item.startDate || new Date(),
      endDate: item.endDate || new Date(),
      nationalId: item.persidNo || '',
      name: item.personName || '',
    }))
  }

  public async validatePlateOwnership(
    auth: User,
    regno: string,
  ): Promise<PlateOwnershipValidation> {
    let errorMessages: ValidationMessage[] | undefined
    let infoMessages: ValidationMessage[] | undefined

    try {
      await this.plateOwnershipApiWithAuth(auth).renewplateownershipPost({
        apiVersion: '1.0',
        apiVersion2: '1.0',
        postRenewPlateOwnershipModel: {
          regno: regno,
          persidno: auth.nationalId,
          check: true, // to make sure we are only validating
        },
      })
    } catch (e) {
      // Note: We had to wrap in try-catch to get the error messages, because if this action results in error,
      // we get 4xx error (instead of 200 with error messages) with the error messages in the body
      errorMessages = getCleanMessagesFromTryCatch(e, 'ERROR')
      infoMessages = getCleanMessagesFromTryCatch(e, 'INFO')
    }

    return {
      hasError: !!errorMessages?.length,
      errorMessages,
      infoMessages,
    }
  }

  public async renewPlateOwnership(
    auth: User,
    regno: string,
  ): Promise<PlateOwnershipValidation> {
    let errorMessages: ValidationMessage[] | undefined
    let infoMessages: ValidationMessage[] | undefined

    try {
      await this.plateOwnershipApiWithAuth(auth).renewplateownershipPost({
        apiVersion: '1.0',
        apiVersion2: '1.0',
        postRenewPlateOwnershipModel: {
          regno: regno,
          persidno: auth.nationalId,
          check: false,
        },
      })
    } catch (e) {
      errorMessages = getCleanMessagesFromTryCatch(e, 'ERROR')
      infoMessages = getCleanMessagesFromTryCatch(e, 'INFO')
    }

    return {
      hasError: !!errorMessages?.length,
      errorMessages,
      infoMessages,
    }
  }

  public async getPlateAvailability(regno: string) {
    return this.plateOwnershipApiWithoutIdsAuth.plateavailableGet({
      regno,
    })
  }
}

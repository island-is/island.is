import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { PlateOwnershipApi } from '../../gen/fetch/apis'
import {
  PlateOwnership,
  PlateOwnershipValidation,
} from './vehiclePlateRenewalClient.types'
import { PlateOwnershipApiWithoutIdsAuth } from './apiConfiguration'

interface ReturnTypeMessage {
  warnSever?: string | null
  errorMess?: string | null
  warningSerialNumber?: number | null
}

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
    let errorList: ReturnTypeMessage[] | undefined

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
      // Note: We need to wrap in try-catch to get the error messages, because if this action results in error,
      // we get 4xx error (instead of 200 with error messages) with the errorList in this field
      // ("body.Errors" for input validation, and "body" for data validation (in database)),
      // that is of the same class as 200 result schema
      if (e?.body?.Errors) {
        errorList = e.body.Errors as ReturnTypeMessage[]
      } else if (e?.body) {
        errorList = e.body as ReturnTypeMessage[]
      } else {
        throw e
      }
    }

    const warnSeverityError = 'E'
    errorList = errorList?.filter(
      (x) => x.errorMess && x.warnSever === warnSeverityError,
    )

    return {
      hasError: !!errorList?.length,
      errorMessages: errorList?.map((item) => {
        return {
          errorNo: (item.warnSever || '_') + item.warningSerialNumber,
          defaultMessage: item.errorMess,
        }
      }),
    }
  }

  public async renewPlateOwnership(auth: User, regno: string): Promise<void> {
    await this.plateOwnershipApiWithAuth(auth).renewplateownershipPost({
      apiVersion: '1.0',
      apiVersion2: '1.0',
      postRenewPlateOwnershipModel: {
        regno: regno,
        persidno: auth.nationalId,
        check: false,
      },
    })
  }

  public async getPlateAvailability(regno: string) {
    return this.plateOwnershipApiWithoutIdsAuth.plateavailableGet({
      regno,
    })
  }
}

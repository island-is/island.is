import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { ReturnTypeMessage } from '../../gen/fetch'
import { PlateRenewalApi } from '../../gen/fetch/apis'
import {
  PlateOwnership,
  PlateOwnershipValidation,
} from './vehiclePlateRenewalClient.types'

@Injectable()
export class VehiclePlateRenewalClient {
  constructor(private readonly plateRenewalApi: PlateRenewalApi) {}

  private plateRenewalApiWithAuth(auth: Auth) {
    return this.plateRenewalApi.withMiddleware(new AuthMiddleware(auth))
  }

  public async getMyPlateOwnerships(
    auth: User,
  ): Promise<Array<PlateOwnership>> {
    // TODOX dummy data while API is not ready
    return [
      {
        regno: 'STINNA',
        startDate: new Date(),
        endDate: new Date(2023, 4, 25),
        nationalId: auth.nationalId,
        name: 'Gervimaður',
        permno: 'ABB12',
      },
      {
        regno: 'JAMJAM',
        startDate: new Date(),
        endDate: new Date(2025, 2, 20),
        nationalId: auth.nationalId,
        name: 'Gervimaður',
        permno: '',
      },
    ]

    const result = await this.plateRenewalApiWithAuth(auth).plateownershipGet({
      apiVersion: '1.0',
      apiVersion2: '1.0',
      getRegnoOwnershipForPersonModel: {
        persidno: auth.nationalId,
        showExpired: false,
      },
    })

    return result.map((item) => ({
      regno: item.regno || '',
      startDate: item.startDate || new Date(),
      endDate: item.endDate || new Date(),
      nationalId: item.persidNo || '',
      name: item.personName || '',
      permno: item.permno || '',
    }))
  }

  public async validatePlateOwnership(
    auth: User,
    regno: string,
  ): Promise<PlateOwnershipValidation> {
    // TODOX dummy data while API is not ready
    return regno === 'JAMJAM'
      ? {
          hasError: true,
          errorMessages: [{ errorNo: '', defaultMessage: 'Dummy error' }],
        }
      : {
          hasError: false,
          errorMessages: [],
        }

    let errorList: ReturnTypeMessage[] | undefined

    try {
      await this.plateRenewalApiWithAuth(auth).renewplateownershipPost({
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
    // TODOX dummy data while API is not ready
    return

    await this.plateRenewalApiWithAuth(auth).renewplateownershipPost({
      apiVersion: '1.0',
      apiVersion2: '1.0',
      postRenewPlateOwnershipModel: {
        regno: regno,
        persidno: auth.nationalId,
        check: false,
      },
    })
  }
}

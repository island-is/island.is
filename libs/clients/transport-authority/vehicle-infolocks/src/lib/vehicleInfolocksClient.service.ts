import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { InfoLockApi } from '../../gen/fetch/apis'
import { AnonymityStatus } from './vehicleInfolocksClient.types'

@Injectable()
export class VehicleInfolocksClient {
  constructor(private readonly infoLockApi: InfoLockApi) {}

  private infoLockApiWithAuth(auth: Auth) {
    return this.infoLockApi.withMiddleware(new AuthMiddleware(auth))
  }

  public async getAnonymityStatus(auth: User): Promise<AnonymityStatus> {
    const anonymityInfoLockType = '2'
    const today = new Date()

    const result = await this.infoLockApiWithAuth(auth).getInfoLock({
      apiVersion: '1.0',
      apiVersion2: '1.0',
      persidno: auth.nationalId,
      infolocktype: anonymityInfoLockType,
    })

    return {
      isValid: result.invalidDate ? result.invalidDate > today : true,
    }
  }

  public async setAnonymityStatus(auth: User, isValid: boolean): Promise<void> {
    const anonymityInfoLockType = '2'
    const today = new Date()

    const currentInfoLock = await this.infoLockApiWithAuth(auth).getInfoLock({
      apiVersion: '1.0',
      apiVersion2: '1.0',
      persidno: auth.nationalId,
      infolocktype: anonymityInfoLockType,
    })

    if (currentInfoLock) {
      await this.infoLockApiWithAuth(auth).rootPut({
        apiVersion: '1.0',
        apiVersion2: '1.0',
        putInfoLockModel: {
          persidno: auth.nationalId,
          infoLockType: anonymityInfoLockType,
          invalidDate: isValid ? null : today,
          explanation: '',
        },
      })
    } else {
      await this.infoLockApiWithAuth(auth).rootPost({
        apiVersion: '1.0',
        apiVersion2: '1.0',
        postInfoLockModel: {
          persidno: auth.nationalId,
          infoLockType: anonymityInfoLockType,
          invalidDate: isValid ? null : today,
          explanation: '',
        },
      })
    }
  }
}

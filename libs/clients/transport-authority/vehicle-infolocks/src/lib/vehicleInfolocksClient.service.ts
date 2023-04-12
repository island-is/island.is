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

  public async getAnonymityStatus(auth: User): Promise<AnonymityStatus | null> {
    const infoLockTypeAnonymity = '2'
    const today = new Date()

    const result = await this.infoLockApiWithAuth(auth).persidnoGet({
      apiVersion: '1.0',
      apiVersion2: '1.0',
      persidno: auth.nationalId,
    })

    const item = result.find((x) => x.infoLockType === infoLockTypeAnonymity)

    if (!item) {
      return null
    }

    let isValid: boolean
    if (!item.invalidDate) {
      isValid = true
    } else {
      isValid = item.invalidDate > today
    }

    return { isChecked: isValid }
  }

  public async setAnonymityStatus(
    auth: User,
    isChecked: boolean,
  ): Promise<void> {
    const infoLockTypeAnonymity = '2'
    const today = new Date()

    const anonymityStatus = await this.getAnonymityStatus(auth)

    if (anonymityStatus) {
      await this.infoLockApiWithAuth(auth).rootPut({
        apiVersion: '1.0',
        apiVersion2: '1.0',
        putInfoLockModel: {
          persidno: auth.nationalId,
          infoLockType: infoLockTypeAnonymity,
          invalidDate: isChecked ? null : today,
          explanation: '',
        },
      })
    } else {
      await this.infoLockApiWithAuth(auth).rootPost({
        apiVersion: '1.0',
        apiVersion2: '1.0',
        postInfoLockModel: {
          persidno: auth.nationalId,
          infoLockType: infoLockTypeAnonymity,
          invalidDate: isChecked ? null : today,
          explanation: '',
        },
      })
    }
  }
}

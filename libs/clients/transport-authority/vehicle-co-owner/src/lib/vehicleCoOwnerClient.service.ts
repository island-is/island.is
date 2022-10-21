import { Injectable } from '@nestjs/common'
import { CoOwnersApi } from '../../gen/fetch/apis'
import { CoOwner } from './vehicleCoOwnerClient.types'

@Injectable()
export class VehicleCoOwnerClient {
  constructor(private readonly coOwnersApi: CoOwnersApi) {}

  public async addOperator(
    currentUserSsn: string,
    permno: string,
    coOwner: CoOwner,
  ): Promise<void> {
    const result = await this.coOwnersApi.rootPost({
      postCoOwne: {
        permno: permno,
        ownerChangeSerialNumber: 123, //TODOx
        coOwnerPersidno: coOwner.ssn || '',
      },
    })
  }
}

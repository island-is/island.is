import { Injectable } from '@nestjs/common'
import { ParentalLeaveApi, ParentalLeave } from '@island.is/vmst-client'

@Injectable()
export class ParentalLeaveService {
  constructor(private parentalLeaveApi: ParentalLeaveApi) {}

  async assignOtherParent() {
    console.log('TODO implement assignOtherParent')
  }

  async assignEmployer() {
    console.log('TODO implement assignEmployer')
  }

  async sendApplication(
    nationalRegistryId: string,
    parentalLeave: ParentalLeave,
  ): Promise<ParentalLeave> {
    return await this.parentalLeaveApi.parentalLeaveSetParentalLeave({
      nationalRegistryId,
      parentalLeave,
    })
  }
}

import { Injectable } from '@nestjs/common'
import { DefaultApi } from '../../gen/fetch'

@Injectable()
export class ChargeFjsV2ClientService {
  constructor(private api: DefaultApi) {}

  async deleteCharge(chargeId: string): Promise<string> {
    const response = await this.api.chargerequestIDDELETE2({
      requestID: chargeId,
    })

    if (!response.receptionID) {
      throw new Error(
        `DELETE chargerequestIDDELETE2 was not successful, response was: ${response.error?.code}`,
      )
    }

    return response.receptionID
  }

  async revertCharge(chargeId: string): Promise<string> {
    // TODOx waiting for new endpoint in FJS api
    return ''
  }
}

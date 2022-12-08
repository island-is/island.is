import { Injectable } from '@nestjs/common'
import { DefaultApi } from '../../gen/fetch'

@Injectable()
export class ChargeFjsV2ClientService {
  constructor(private api: DefaultApi) {}

  async getChargeStatus(chargeId: string): Promise<string> {
    const response = await this.api.chargeStatusByRequestIDrequestIDGET4({
      requestID: chargeId,
    })

    return response.statusResult?.status
  }

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
}

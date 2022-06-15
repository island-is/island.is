import { Injectable } from '@nestjs/common'
import { DefaultApi } from '../../gen/fetch'

@Injectable()
export class ChargeFjsV2Api {
  constructor(private readonly api: DefaultApi) {}

  public async deleteCharge(requestId: string): Promise<string> {
    const response = await this.api.chargerequestIDDELETE2({
      requestID: requestId,
    })

    return response.receptionID //TODOx what should be returned
  }
}

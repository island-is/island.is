import { Inject, Injectable } from '@nestjs/common'
import { UmbodsmadurSkuldaraClientConfig } from '../../umsCostOfLivingCalculator.config'
import { ConfigType } from '@nestjs/config'
export interface CostOfLivingCalculatorRequest {
  fjMerking: string
  fot: number
  laek: number
  matur: number
  onnurthon: number
  samgongur: number
  samskipti: number
  samtals: number
  text: string
  tom: number
}
@Injectable()
export class CostOfLivingCalculatorApi {
  constructor(
    @Inject(UmbodsmadurSkuldaraClientConfig.KEY)
    private clientConfig: ConfigType<typeof UmbodsmadurSkuldaraClientConfig>,
  ) {}
  async getCalculatorData(): Promise<Array<CostOfLivingCalculatorRequest>> {
    const response = await Promise.all([
      fetch(this.clientConfig.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({ isEinstaklingur: 'false' }),
      }),
      fetch(this.clientConfig.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({ isEinstaklingur: 'true' }),
      }),
    ])

    const data1 = await response[0].json()
    const data2 = await response[1].json()

    const data = [...data1.d, ...data2.d]

    return data
  }
}

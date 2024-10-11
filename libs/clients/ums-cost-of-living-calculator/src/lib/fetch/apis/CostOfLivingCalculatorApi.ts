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
    const data = await Promise.all(
      [false, true].map((isEinstaklingur) =>
        fetch(this.clientConfig.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
          body: JSON.stringify({ isEinstaklingur: isEinstaklingur.toString() }),
        }).then((response) => response.json()),
      ),
    )

    return [...data[0].d, ...data[1].d]
  }
}

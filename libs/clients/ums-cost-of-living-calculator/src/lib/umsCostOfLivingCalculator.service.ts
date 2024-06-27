import { Injectable } from '@nestjs/common'
import { CostOfLivingCalculatorApi } from './fetch/apis/CostOfLivingCalculatorApi'

@Injectable()
export class UmsCostOfLivingCalculatorClientService {
  constructor(private readonly calculatorApi: CostOfLivingCalculatorApi) {}

  async getCalculatorData() {
    const calculator = await this.calculatorApi.getCalculatorData()

    return calculator.map((item) => ({
      numberOf: item.fjMerking,
      clothes: item.fot,
      medicalCost: item.laek,
      food: item.matur,
      otherServices: item.onnurthon,
      transport: item.samgongur,
      communication: item.samskipti,
      total: item.samtals,
      text: item.text,
      hobby: item.tom,
    }))
  }
}

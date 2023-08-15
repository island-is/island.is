import { Injectable } from '@nestjs/common'
import { ReiknivelApi } from '../../gen/fetch'

@Injectable()
export class HousingBenefitCalculatorClientService {
  constructor(private readonly api: ReiknivelApi) {}

  // Translate these fields to english, reference: https://hms.is/en/loans-and-benefits/housing-benefit/housing-benefits-calculator
  async calculate(input: {
    totalAssets: number
    totalIncome: number
    housingCosts: number
    numberOfHouseholdMembers: number
  }) {
    return this.api.apiVversionReiknivelReiknivelPost({
      heildarEignir: input.totalAssets,
      heildarTekjur: input.totalIncome,
      husnaedisKostnadur: input.housingCosts,
      fjoldiHeimilismanna: input.numberOfHouseholdMembers,
      version: '1',
    })
  }
}

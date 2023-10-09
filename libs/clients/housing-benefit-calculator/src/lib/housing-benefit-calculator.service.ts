import { Inject } from '@nestjs/common'
import type { ConfigType } from '@island.is/nest/config'
import { FetchError } from '@island.is/clients/middlewares'
import { AuthHeaderMiddleware } from '@island.is/auth-nest-tools'
import { AuthenticateApi, ReiknivelApi } from '../../gen/fetch'
import { HousingBenefitCalculatorClientConfig } from './housing-benefit-calculator.config'

interface CalculateInput {
  numberOfHouseholdMembers: number
  totalMonthlyIncome: number
  totalAssets: number
  housingCostsPerMonth: number
}

const round = (value: number | null | undefined) => {
  return typeof value === 'number' ? Math.round(value) : value
}

export class HousingBenefitCalculatorClientService {
  private loginToken: string | null | undefined = null

  constructor(
    @Inject(HousingBenefitCalculatorClientConfig.KEY)
    private clientConfig: ConfigType<
      typeof HousingBenefitCalculatorClientConfig
    >,
    private readonly authenticationApi: AuthenticateApi,
    private readonly calculationApi: ReiknivelApi,
  ) {}

  private async getAuthenticatedCalculationApi(fetchNewToken = false) {
    if (fetchNewToken || !this.loginToken) {
      const loginData = await this.authenticationApi.apiV1AuthenticateTokenPost(
        {
          loginModel: {
            username: this.clientConfig.username,
            password: this.clientConfig.password,
          },
        },
      )
      this.loginToken = loginData.token
    }

    return this.calculationApi.withMiddleware(
      new AuthHeaderMiddleware(`Bearer ${this.loginToken}`),
    )
  }

  private async fetchCalculation(input: CalculateInput, fetchNewToken = false) {
    const authenticatedCalculationApi =
      await this.getAuthenticatedCalculationApi(fetchNewToken)

    const calculationData =
      await authenticatedCalculationApi.apiV1ReiknivelReiknivelPost({
        fjoldiHeimilismanna: input.numberOfHouseholdMembers,
        heildarTekjur: input.totalMonthlyIncome,
        heildarEignir: input.totalAssets,
        husnaedisKostnadur: input.housingCostsPerMonth,
      })
    return {
      maximumHousingBenefits: round(calculationData.manadarlegarHamarksBaetur),
      reductionsDueToIncome: round(calculationData.manadarlegTekjuSkerding),
      reductionsDueToAssets: round(calculationData.manadarlegEignaSkerding),
      reductionsDueToHousingCosts: round(
        calculationData.manadarlegHusnaedisKostnadarSkerding,
      ),
      estimatedHousingBenefits: round(
        calculationData.manadarlegarHusnaedisbaetur,
      ),
    }
  }

  async calculate(input: CalculateInput) {
    try {
      return await this.fetchCalculation(input)
    } catch (error) {
      if (error instanceof FetchError && error.status === 401) {
        // Renew token if we are unauthorized (most likely due to token expiring)
        return this.fetchCalculation(input, true)
      }
      throw error
    }
  }
}

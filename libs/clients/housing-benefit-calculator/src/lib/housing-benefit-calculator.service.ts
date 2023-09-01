import { Inject } from '@nestjs/common'
import type { ConfigType } from '@island.is/nest/config'
import { AuthHeaderMiddleware } from '@island.is/auth-nest-tools'
import { AuthenticateApi, ReiknivelApi } from '../../gen/fetch'
import { HousingBenefitCalculatorClientConfig } from './housing-benefit-calculator.config'

export class HousingBenefitCalculatorClientService {
  constructor(
    @Inject(HousingBenefitCalculatorClientConfig.KEY)
    private clientConfig: ConfigType<
      typeof HousingBenefitCalculatorClientConfig
    >,
    private readonly authenticationApi: AuthenticateApi,
    private readonly calculationApi: ReiknivelApi,
  ) {}

  private async getAuthenticatedCalculationApi() {
    const loginData =
      (await this.authenticationApi.apiV1AuthenticateTokenPostRaw({
        loginModel: {
          username: this.clientConfig.username,
          password: this.clientConfig.password,
        },
        // TODO: Ask HMS to fix their swagger return type
      })) as unknown as { token: string; expiration: string }

    return this.calculationApi.withMiddleware(
      new AuthHeaderMiddleware(`Bearer ${loginData.token}`),
    )
  }

  async calculate(input: {
    numberOfHouseholdMembers: number
    totalMonthlyIncome: number
    totalAssets: number
    housingCostsPerMonth: number
  }) {
    // TODO: only authenticate if we get a rejection instead of for every request
    const authenticatedCalculationApi =
      await this.getAuthenticatedCalculationApi()

    const calculationData =
      await authenticatedCalculationApi.apiV1ReiknivelReiknivelPost({
        fjoldiHeimilismanna: input.numberOfHouseholdMembers,
        heildarTekjur: input.totalMonthlyIncome,
        heildarEignir: input.totalAssets,
        husnaedisKostnadur: input.housingCostsPerMonth,
      })

    return {
      maximumHousingBenefits: calculationData.manadarlegarHamarksBaetur,
      reductions: calculationData.manadarlegHusnaedisKostnadarSkerding,
      estimatedHousingBenefits: calculationData.manadarlegarHusnaedisbaetur,
    }
  }
}

import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { SocialInsuranceAdministrationClientService } from '@island.is/clients/social-insurance-administration'
import { User } from '@island.is/auth-nest-tools'

@Injectable()
export class SocialInsuranceService {
  constructor(
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
    private readonly socialInsuranceApi: SocialInsuranceAdministrationClientService,
  ) {}

  async getPaymentPlan(user: User, year?: number): Promise<void> {
    const paymentPlan = await this.socialInsuranceApi.getPaymentPlan(
      user,
      year ?? 2023,
    )
  }
}

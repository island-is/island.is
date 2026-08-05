import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import { Injectable } from '@nestjs/common'
import {
  PaymentTypesOverviewApi,
  TrWebContractsExternalDigitalIcelandPaymentTypesOverviewBenefitChildrenInformationReturn,
  TrWebContractsExternalDigitalIcelandPaymentTypesOverviewPaymentTypesOverviewReturn,
} from '../../../gen/fetch/v1'

@Injectable()
export class SocialInsuranceAdministrationPaymentTypesOverviewService {
  constructor(
    private readonly paymentTypesOverviewApi: PaymentTypesOverviewApi,
  ) {}

  private paymentTypesOverviewApiWithAuth = (user: User) =>
    this.paymentTypesOverviewApi.withMiddleware(
      new AuthMiddleware(user as Auth),
    )

  async getPaymentTypesOverview(
    user: User,
  ): Promise<
    | TrWebContractsExternalDigitalIcelandPaymentTypesOverviewPaymentTypesOverviewReturn[]
    | null
  > {
    const result = await this.paymentTypesOverviewApiWithAuth(user)
      .apiProtectedV1PaymentTypesOverviewPaymentTypesOverviewGet()
      .catch(handle404)
    return result?.paymentOverview ?? null
  }

  async getChildBenefitsInformation(
    user: User,
  ): Promise<
    | TrWebContractsExternalDigitalIcelandPaymentTypesOverviewBenefitChildrenInformationReturn[]
    | null
  > {
    const result = await this.paymentTypesOverviewApiWithAuth(user)
      .apiProtectedV1PaymentTypesOverviewBenefitChildrenInformationGet()
      .catch(handle404)
    return result?.benefitChildren ?? null
  }
}

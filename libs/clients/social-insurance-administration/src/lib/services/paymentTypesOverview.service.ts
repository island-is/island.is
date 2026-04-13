import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'
import { Injectable } from '@nestjs/common'
import {
  PaymentTypesOverviewApi,
  TrWebApiServicesCommonClientsModelsGetPaymentTypesOverviewReturn,
  TrWebApiServicesCommonClientsModelsGetBenefitChildrenInformationReturn,
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
    TrWebApiServicesCommonClientsModelsGetPaymentTypesOverviewReturn[] | null
  > {
    return this.paymentTypesOverviewApiWithAuth(user)
      .apiProtectedV1PaymentTypesOverviewPaymentTypesOverviewGet({})
      .then((result) => result?.paymentOverview ?? null)
      .catch(handle404)
  }

  async getChildBenefitsInformation(
    user: User,
  ): Promise<
    | TrWebApiServicesCommonClientsModelsGetBenefitChildrenInformationReturn[]
    | null
  > {
    return this.paymentTypesOverviewApiWithAuth(user)
      .apiProtectedV1PaymentTypesOverviewBenefitChildrenInformationGet({})
      .then((result) => result?.benefitChildren ?? null)
      .catch(handle404)
  }
}

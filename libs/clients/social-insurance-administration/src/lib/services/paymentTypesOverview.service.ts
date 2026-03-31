import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
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
      .catch((error) => {
        if (error?.status === 404) return null
        throw error
      })
  }

  async getBenefitChildrenInformation(
    user: User,
  ): Promise<
    | TrWebApiServicesCommonClientsModelsGetBenefitChildrenInformationReturn[]
    | null
  > {
    return this.paymentTypesOverviewApiWithAuth(user)
      .apiProtectedV1PaymentTypesOverviewBenefitChildrenInformationGet({})
      .catch((error) => {
        if (error?.status === 404) return null
        throw error
      })
  }
}

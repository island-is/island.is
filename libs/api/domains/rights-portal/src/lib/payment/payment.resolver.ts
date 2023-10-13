import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { PaymentService } from './payment.service'
import { ApiScope } from '@island.is/auth/scopes'
import { CopaymentStatusResponse } from './models/copaymentStatus.response'
import { CopaymentPeriodResponse } from './models/copaymentPeriods.response'
import { CopaymentBillsInput } from './dto/copaymentBills.input'
import { CopaymentBillResponse } from './models/copaymentBill.response'
import { PaymentOverviewStatusResponse } from './models/paymentOverviewStatus.response'
import { PaymentOverviewBillResponse } from './models/paymentOverviewBill.response'
import { PaymentOverviewDocumentResponse } from './models/paymentOverviewDocument.response'
import { PaymentOverviewDocumentInput } from './dto/paymentOverviewDocument.input'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.servicePortalHealthRightsModule)
@Audit({ namespace: '@island.is/api/rights-portal/payment' })
export class OverviewResolver {
  constructor(private readonly service: PaymentService) {}

  @Query(() => CopaymentStatusResponse, {
    name: 'rightsPortalCopaymentStatus',
  })
  @Scopes(ApiScope.health)
  @Audit()
  async getCopaymentStatus(
    @CurrentUser() user: User,
  ): Promise<CopaymentStatusResponse> {
    return await this.service.getCopaymentStatus(user)
  }

  @Query(() => CopaymentPeriodResponse, {
    name: 'rightsPortalCopaymentPeriods',
  })
  @Scopes(ApiScope.health)
  @Audit()
  async getCopaymentPeriods(
    @CurrentUser() user: User,
  ): Promise<CopaymentPeriodResponse> {
    return await this.service.getCopaymentPeriods(user)
  }

  @Query(() => CopaymentBillResponse, {
    name: 'rightsPortalCopaymentBills',
  })
  @Scopes(ApiScope.health)
  @Audit()
  async getCopaymentBills(
    @CurrentUser() user: User,
    @Args('input') input: CopaymentBillsInput,
  ): Promise<CopaymentBillResponse> {
    return await this.service.getCopaymentBills(user, input)
  }

  @Query(() => PaymentOverviewStatusResponse, {
    name: 'rightsPortalPaymentOverviewStatus',
  })
  @Scopes(ApiScope.health)
  @Audit()
  async getPaymentOverviewStatus(
    @CurrentUser() user: User,
  ): Promise<PaymentOverviewStatusResponse> {
    return await this.service.getPaymentOverviewStatus(user)
  }

  @Query(() => PaymentOverviewBillResponse, {
    name: 'rightsPortalPaymentOverviewBills',
  })
  @Scopes(ApiScope.health)
  @Audit()
  async getPaymentOverviewBills(
    @CurrentUser() user: User,
  ): Promise<PaymentOverviewBillResponse> {
    return await this.service.getPaymentOverviewBills(user)
  }

  @Query(() => PaymentOverviewDocumentResponse, {
    name: 'rightsPortalPaymentOverviewDocument',
  })
  @Scopes(ApiScope.health)
  @Audit()
  async getPaymentOverviewDocument(
    @CurrentUser() user: User,
    @Args('input') input: PaymentOverviewDocumentInput,
  ): Promise<PaymentOverviewDocumentResponse> {
    return await this.service.getPaymentOverviewBillDocument(user, input)
  }
}

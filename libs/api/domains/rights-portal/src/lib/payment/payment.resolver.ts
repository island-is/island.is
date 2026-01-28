import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import {
  FeatureFlagGuard,
  FeatureFlag,
  Features,
} from '@island.is/nest/feature-flags'
import { Audit } from '@island.is/nest/audit'
import type { User } from '@island.is/auth-nest-tools'
import { Inject, UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { PaymentService } from './payment.service'
import { ApiScope } from '@island.is/auth/scopes'
import { CopaymentPeriodResponse } from './models/copaymentPeriods.response'
import { CopaymentBillsInput } from './dto/copaymentBills.input'
import { CopaymentBillResponse } from './models/copaymentBill.response'
import { PaymentOverviewResponse } from './models/paymentOverview.response'
import { PaymentOverviewDocumentResponse } from './models/paymentOverviewDocument.response'
import { PaymentOverviewDocumentInput } from './dto/paymentOverviewDocument.input'
import { PaymentOverviewInput } from './dto/paymentOverview.input'
import { PaymentOverviewServiceTypeResponse } from './models/paymentOverviewServiceType.response'
import { CopaymentPeriodInput } from './dto/copaymentPeriod.input'
import { DownloadServiceConfig } from '@island.is/nest/config'
import { ConfigType } from '@nestjs/config'
import { CopaymentStatus } from './models/copaymentStatus.model'
import { PaymentOverviewTotalsServiceTypeResponse } from './models/paymentOverviewTotalsServiceType.response'
import { PaymentOverviewTotalsResponse } from './models/paymentOverviewTotals.response'

@Resolver()
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Audit({ namespace: '@island.is/api/rights-portal/payment' })
export class PaymentResolver {
  constructor(
    private readonly service: PaymentService,
    @Inject(DownloadServiceConfig.KEY)
    private downloadServiceConfig: ConfigType<typeof DownloadServiceConfig>,
  ) {}

  @Query(() => CopaymentStatus, {
    name: 'rightsPortalCopaymentStatus',
    nullable: true,
  })
  @Scopes(ApiScope.healthPayments)
  @Audit()
  async getCopaymentStatus(
    @CurrentUser() user: User,
  ): Promise<CopaymentStatus | null> {
    return this.service.getCopaymentStatus(user)
  }

  @Query(() => CopaymentPeriodResponse, {
    name: 'rightsPortalCopaymentPeriods',
  })
  @Scopes(ApiScope.healthPayments)
  @Audit()
  async getCopaymentPeriods(
    @CurrentUser() user: User,
    @Args('input') input: CopaymentPeriodInput,
  ): Promise<CopaymentPeriodResponse> {
    return await this.service.getCopaymentPeriods(user, input)
  }

  @Query(() => CopaymentBillResponse, {
    name: 'rightsPortalCopaymentBills',
  })
  @Scopes(ApiScope.healthPayments)
  @Audit()
  async getCopaymentBills(
    @CurrentUser() user: User,
    @Args('input') input: CopaymentBillsInput,
  ): Promise<CopaymentBillResponse> {
    return await this.service.getCopaymentBills(user, input)
  }

  @Query(() => PaymentOverviewServiceTypeResponse, {
    name: 'rightsPortalPaymentOverviewServiceTypes',
  })
  @Scopes(ApiScope.healthPayments)
  @Audit()
  async getPaymentOverviewServiceTypes(
    @CurrentUser() user: User,
  ): Promise<PaymentOverviewServiceTypeResponse> {
    return await this.service.getPaymentOverviewServiceTypes(user)
  }

  @Query(() => PaymentOverviewResponse, {
    name: 'rightsPortalPaymentOverview',
  })
  @Scopes(ApiScope.healthPayments)
  @Audit()
  async getPaymentOverview(
    @CurrentUser() user: User,
    @Args('input') input: PaymentOverviewInput,
  ): Promise<PaymentOverviewResponse> {
    const data = await this.service.getPaymentOverview(user, input)

    const items = data.items.map((item) => ({
      ...item,
      bills: item?.bills?.map((bill) => ({
        ...bill,
        downloadUrl: `${this.downloadServiceConfig.baseUrl}/download/v1/health/payments/${bill.documentId}`,
      })),
    }))

    return {
      items: items,
      errors: data.errors,
    }
  }

  @Query(() => PaymentOverviewDocumentResponse, {
    name: 'rightsPortalPaymentOverviewDocument',
  })
  @Scopes(ApiScope.healthPayments)
  @Audit()
  @FeatureFlag(Features.healthPaymentOverview)
  async getPaymentOverviewDocument(
    @CurrentUser() user: User,
    @Args('input') input: PaymentOverviewDocumentInput,
  ): Promise<PaymentOverviewDocumentResponse> {
    return await this.service.getPaymentOverviewBillDocument(user, input)
  }

  @Query(() => PaymentOverviewTotalsServiceTypeResponse, {
    name: 'rightsPortalPaymentOverviewTotalsServiceTypes',
  })
  @Scopes(ApiScope.healthPayments)
  @Audit()
  async getPaymentOverviewTotalsServiceTypes(
    @CurrentUser() user: User,
  ): Promise<PaymentOverviewTotalsServiceTypeResponse> {
    return await this.service.getPaymentOverviewTotalsServiceTypes(user)
  }

  @Query(() => PaymentOverviewTotalsResponse, {
    name: 'rightsPortalPaymentOverviewTotals',
  })
  @Scopes(ApiScope.healthPayments)
  @Audit()
  async getPaymentOverviewTotals(
    @CurrentUser() user: User,
    @Args('input') input: PaymentOverviewInput,
  ): Promise<PaymentOverviewTotalsResponse> {
    return await this.service.getPaymentOverviewTotals(user, input)
  }

  @Query(() => PaymentOverviewDocumentResponse, {
    name: 'rightsPortalPaymentOverviewTotalsPdf',
  })
  @Scopes(ApiScope.healthPayments)
  @Audit()
  async getPaymentOverviewTotalsPdf(
    @CurrentUser() user: User,
    @Args('input') input: PaymentOverviewInput,
  ): Promise<PaymentOverviewDocumentResponse> {
    return await this.service.getPaymentOverviewTotalsPdf(user, input)
  }
}

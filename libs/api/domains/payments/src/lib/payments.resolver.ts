import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { ApolloError } from '@apollo/client'

import { IdsUserGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'

import {
  GetPaymentFlowAdminInput,
  GetPaymentFlowInput,
} from './dto/getPaymentFlow.input'
import {
  GetPaymentFlowResponse,
  PaymentFlowAdminResponse,
} from './dto/getPaymentFlow.response'
import { PaymentsService } from './payments.service'
import { VerifyCardResponse } from './dto/verifyCard.response'
import { VerifyCardInput } from './dto/verifyCard.input'
import { ChargeCardInput } from './dto/chargeCard.input'
import { ChargeCardResponse } from './dto/chargeCard.response'
import { GetPaymentVerificationStatusResponse } from './dto/getVerificationStatus.response'
import { CardVerificationCallbackInput } from './dto/cardVerificationCallback.input'
import { CreateInvoiceResponse } from './dto/createInvoice.response'
import { CreateInvoiceInput } from './dto/createInvoice.input'
import { CardVerificationResponse } from './dto/cardVerificationCallback.response'
import { GetJwksResponse } from './dto/getJwks.response'
import { GetPaymentFlowsInput } from './dto/getPaymentFlows.input'
import { GetPaymentFlowsResponse } from './dto/getPaymentFlows.response'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { GetApplePaySessionResponse } from './dto/getApplePaySession.response'
import { ApplePayChargeInput } from './dto/applePayCharge.input'
import { ApplePayChargeResponse } from './dto/applePayCharge.response'

@UseGuards(FeatureFlagGuard)
@FeatureFlag(Features.isIslandisPaymentEnabled)
@Resolver()
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Query(() => GetPaymentFlowsResponse, { name: 'paymentsGetFlows' })
  async getPaymentFlows(
    @Args('input', { type: () => GetPaymentFlowsInput })
    input: GetPaymentFlowsInput,
  ): Promise<GetPaymentFlowsResponse> {
    try {
      return this.paymentsService.getPaymentFlows(input)
    } catch (e) {
      throw new ApolloError(e.message)
    }
  }

  @Query(() => GetPaymentFlowResponse, { name: 'paymentsGetFlow' })
  async getPaymentFlow(
    @Args('input', { type: () => GetPaymentFlowInput })
    input: GetPaymentFlowInput,
  ): Promise<GetPaymentFlowResponse> {
    try {
      return this.paymentsService.getPaymentFlow(input)
    } catch (e) {
      throw new ApolloError(e.message)
    }
  }

  @UseGuards(IdsUserGuard, ScopesGuard)
  @Scopes(AdminPortalScope.payments)
  @Query(() => PaymentFlowAdminResponse, { name: 'paymentsGetFlowAdmin' })
  async getPaymentFlowAdmin(
    @Args('input', { type: () => GetPaymentFlowAdminInput })
    input: GetPaymentFlowAdminInput,
  ): Promise<PaymentFlowAdminResponse> {
    return this.paymentsService.getPaymentFlow(input, true)
  }

  @Query(() => GetPaymentVerificationStatusResponse, {
    name: 'paymentsGetVerificationStatus',
  })
  async getVerificationStatus(
    @Args('input', { type: () => GetPaymentFlowInput })
    input: GetPaymentFlowInput,
  ): Promise<GetPaymentVerificationStatusResponse> {
    return this.paymentsService.getVerificationStatus(input)
  }

  @Mutation(() => VerifyCardResponse, { name: 'paymentsVerifyCard' })
  async verifyCard(
    @Args('input', { type: () => VerifyCardInput })
    input: VerifyCardInput,
  ): Promise<VerifyCardResponse> {
    try {
      return this.paymentsService.verifyCard(input)
    } catch (e) {
      throw new ApolloError(e.message)
    }
  }

  @Mutation(() => CardVerificationResponse, {
    name: 'paymentsVerificationCallback',
  })
  async verificationCallback(
    @Args('input', { type: () => CardVerificationCallbackInput })
    input: CardVerificationCallbackInput,
  ): Promise<CardVerificationResponse> {
    try {
      return this.paymentsService.verifyCardCallback(input)
    } catch (e) {
      throw new ApolloError(e.message)
    }
  }

  @Mutation(() => ChargeCardResponse, { name: 'paymentsChargeCard' })
  async chargeCard(
    @Args('input', { type: () => ChargeCardInput })
    input: ChargeCardInput,
  ): Promise<ChargeCardResponse> {
    try {
      return this.paymentsService.chargeCard(input)
    } catch (e) {
      throw new ApolloError(e.message)
    }
  }

  @Mutation(() => CreateInvoiceResponse, { name: 'paymentsCreateInvoice' })
  async createInvoice(
    @Args('input', { type: () => CreateInvoiceInput })
    input: CreateInvoiceInput,
  ): Promise<CreateInvoiceResponse> {
    try {
      return this.paymentsService.createInvoice(input)
    } catch (e) {
      throw new ApolloError(e.message)
    }
  }

  @Query(() => GetJwksResponse, { name: 'paymentsGetJwks' })
  async getJwks(): Promise<GetJwksResponse> {
    try {
      return this.paymentsService.getJwks()
    } catch (e) {
      throw new ApolloError(e.message)
    }
  }

  @Query(() => GetApplePaySessionResponse, {
    name: 'paymentsGetApplePaySession',
  })
  async getApplePaySession(): Promise<GetApplePaySessionResponse> {
    try {
      return this.paymentsService.getApplePaySession()
    } catch (e) {
      throw new ApolloError(e.message)
    }
  }

  @Mutation(() => ApplePayChargeResponse, { name: 'paymentsChargeApplePay' })
  async chargeApplePay(
    @Args('input', { type: () => ApplePayChargeInput })
    input: ApplePayChargeInput,
  ): Promise<ApplePayChargeResponse> {
    try {
      return this.paymentsService.chargeApplePay(input)
    } catch (e) {
      throw new ApolloError(e.message)
    }
  }
}

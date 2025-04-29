import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import { ScopesGuard } from '@island.is/auth-nest-tools'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'

import { GetPaymentFlowInput } from './dto/getPaymentFlow.input'
import { GetPaymentFlowResponse } from './dto/getPaymentFlow.response'
import { PaymentsService } from './payments.service'
import { VerifyCardResponse } from './dto/verifyCard.response'
import { VerifyCardInput } from './dto/verifyCard.input'
import { ChargeCardInput } from './dto/chargeCard.input'
import { ChargeCardResponse } from './dto/chargeCard.response'
import { GetPaymentVerificationStatusResponse } from './dto/getVerificationStatus.response'
import { CardVerificationCallbackInput } from './dto/cardVerificationCallback.input'
import { ApolloError } from '@apollo/client'
import { CreatePaymentFlowInput } from './dto/createPaymentFlow.input'
import { CreatePaymentFlowResponse } from './dto/createPaymentFlow.response'
import { CreateInvoiceResponse } from './dto/createInvoice.response'
import { CreateInvoiceInput } from './dto/createInvoice.input'
import { CardVerificationResponse } from './dto/cardVerificationCallback.response'

@UseGuards(ScopesGuard, FeatureFlagGuard)
@FeatureFlag(Features.isIslandisPaymentEnabled)
@Resolver()
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

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
}

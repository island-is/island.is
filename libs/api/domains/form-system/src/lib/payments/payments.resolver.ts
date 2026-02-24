import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import {
  PaymentApprovedInput,
  PaymentCallbackInput,
  PaymentStatusInput,
} from '../../dto/payment.input'
import { PaymentStatusResponse } from '../../models/payment.model'
import { PaymentsService } from './payments.service'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Query(() => PaymentStatusResponse, {
    name: 'formSystemPaymentStatus',
  })
  async getPaymentStatus(
    @Args('input', { type: () => PaymentStatusInput })
    input: PaymentStatusInput,
    @CurrentUser() user: User,
  ): Promise<PaymentStatusResponse> {
    return this.paymentsService.getPaymentStatus(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemPaymentCallback',
  })
  async paymentCallback(
    @Args('input', { type: () => PaymentCallbackInput })
    input: PaymentCallbackInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.paymentsService.paymentCallback(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemPaymentApprovedCallback',
  })
  async paymentApprovedCallback(
    @Args('input', { type: () => PaymentApprovedInput })
    input: PaymentApprovedInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.paymentsService.paymentApprovedCallback(user, input)
  }
}

import {
  Body,
  Controller,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'

import { PaymentType as BasePayment } from '@island.is/application/core'
import { ApplicationScope } from '@island.is/auth/scopes'
import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { PaymentAPI } from '@island.is/clients/payment'
import { AuditService } from '@island.is/nest/audit'

import { CreateChargeInput } from './dto/createChargeInput.dto'
import { PaymentStatusResponseDto } from './dto/paymentStatusResponse.dto'
import { CreatePaymentResponseDto } from './dto'
import { Payment } from './payment.model'
import { PaymentService } from './payment.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('payments')
@ApiHeader({
  name: 'authorization',
  description: 'Bearer token authorization',
})
@ApiHeader({
  name: 'locale',
  description: 'Front-end language selected',
})
@Controller()
export class PaymentController {
  constructor(
    private readonly auditService: AuditService,
    private readonly paymentService: PaymentService,
    private readonly paymentAPI: PaymentAPI,
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
  ) {}
  @Scopes(ApplicationScope.write)
  @Post('applications/:applicationId/payment')
  @ApiCreatedResponse({ type: CreatePaymentResponseDto })
  async createCharge(
    @CurrentUser() user: User,
    @Param('applicationId', new ParseUUIDPipe()) applicationId: string,
    @Body() payload: CreateChargeInput,
  ): Promise<CreatePaymentResponseDto> {
    const chargeItem = await this.paymentService.findChargeItem(
      payload.chargeItemCode,
    )

    const paymentDto: Pick<
      BasePayment,
      'application_id' | 'fulfilled' | 'amount' | 'definition' | 'expires_at'
    > = {
      application_id: applicationId,
      fulfilled: false,
      amount: chargeItem.priceAmount,
      definition: {
        chargeItemName: chargeItem.chargeItemName,
        chargeItemCode: chargeItem.chargeItemCode,
        performingOrganiationID: chargeItem.performingOrgID,
        chargeType: chargeItem.chargeType,
        amount: chargeItem.priceAmount,
      },
      expires_at: new Date(),
    }

    const payment = await this.paymentModel.create(paymentDto)

    const chargeResult = await this.paymentService.createCharge(payment, user)

    this.auditService.audit({
      auth: user,
      action: 'createCharge',
      resources: paymentDto.application_id as string,
      meta: { applicationId: paymentDto.application_id, id: payment.id },
    })

    await this.paymentModel.update(
      {
        user4: chargeResult.user4,
      },
      {
        where: {
          id: payment.id,
          application_id: applicationId,
        },
      },
    )

    return {
      id: payment.id,
      paymentUrl: chargeResult.paymentUrl,
    }
  }

  @Scopes(ApplicationScope.read)
  @Get('applications/:applicationId/payment-status')
  @ApiOkResponse({ type: PaymentStatusResponseDto })
  @ApiParam({
    name: 'applicationId',
    type: String,
    required: true,
    description: 'The id of the application check if it is paid.',
  })
  async getPaymentStatus(
    @Param('applicationId', new ParseUUIDPipe()) applicationId: string,
  ): Promise<PaymentStatusResponseDto> {
    const payment = await this.paymentService.findPaymentByApplicationId(
      applicationId,
    )

    if (!payment) {
      throw new NotFoundException(
        `payment object was not found for application id ${applicationId}`,
      )
    }

    if (!payment.user4) {
      throw new InternalServerErrorException(
        `valid payment object was not found for application id ${applicationId} - user4 not set`,
      )
    }

    return {
      // TODO: maybe treat the case where no payment was found differently?
      // not sure how/if that case would/could come up.
      fulfilled: payment.fulfilled || false,
      paymentUrl: this.paymentService.makePaymentUrl(payment.user4),
    }
  }
}

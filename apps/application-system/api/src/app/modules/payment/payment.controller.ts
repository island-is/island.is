import {
  Body,
  Controller,
  Param,
  Post,
  UseInterceptors,
  UseGuards,
  Put,
  Get,
} from '@nestjs/common'

import {
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
  ApiHeader,
} from '@nestjs/swagger'
import { PaymentType as BasePayment } from '@island.is/application/core'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { ApplicationScope } from '@island.is/auth/scopes'
import { Audit, AuditService } from '@island.is/nest/audit'
import { CreatePaymentDto } from './dto/createPayment.dto'
import { CreatePaymentResponseDto } from './dto/createPaymentResponse.dto'
import { ApplicationSerializer } from '../application/tools/application.serializer'
import { InjectModel } from '@nestjs/sequelize'
import { Payment } from './payment.model'
import { Callback } from '@island.is/api/domains/payment'
import { PaymentService } from './payment.service'
import { PaymentStatusResponseDto } from './dto/paymentStatusResponse.dto'

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
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
  ) {}
  @Scopes(ApplicationScope.write)
  @ApiParam({
    name: 'application_id',
    type: String,
    required: true,
    description: 'The id of the application to submit payment for.',
  })
  @Post('applications/:application_id/payment')
  @ApiCreatedResponse({ type: CreatePaymentResponseDto })
  @UseInterceptors(ApplicationSerializer)
  @Audit<CreatePaymentResponseDto>({
    resources: (app) => app.id,
  })
  async paymentApplication(
    @Body()
    paymentDetails: CreatePaymentDto,
    @CurrentUser()
    user: User,
  ): Promise<CreatePaymentResponseDto> {
    // FIGURE SOME CHECK FOR LEGIT PAYMENT
    //     `No application found for application id: ${applicationId}`,

    const paymentDto: Pick<
      BasePayment,
      | 'application_id'
      | 'fulfilled'
      | 'reference_id'
      | 'user4'
      | 'definition'
      | 'amount'
      | 'expires_at'
    > = {
      application_id: paymentDetails.application_id,
      fulfilled: false,
      reference_id: '',
      user4: paymentDetails.user4 || '',
      definition: paymentDetails.definition || '',
      amount: paymentDetails.amount || 0,
      expires_at: new Date(),
    }

    this.auditService.audit({
      user,
      action: 'create',
      resources: paymentDto.application_id as string,
      meta: { applicationId: paymentDto.application_id },
    })
    // possible duplication of model creation.. happens also in service... refactor?
    return await this.paymentModel.create(paymentDto)
  }

  @Scopes(ApplicationScope.write)
  @Put('applications/:application_id/payment/:id')
  @ApiParam({
    name: 'application_id',
    type: String,
    required: true,
    description: 'The id of the application to update fulfilled status.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
    description: 'The id of the payment.',
  })
  async paymentApproved(
    @Param('id') id: string,
    @Param('application_id') applicationId: string,
    @Body()
    paymentDetails: CreatePaymentResponseDto,
    callback: Callback,
    @CurrentUser()
    user: User,
  ): Promise<CreatePaymentResponseDto> {
    const payment = await this.paymentService.findPaymentByApplicationId(
      applicationId,
      id,
    )
    // response obj because we are updating a row in db.
    if (payment) {
      this.auditService.audit({
        user,
        action: 'approvePaymentApplication',
        resources: applicationId,
        meta: { applicationId: applicationId, id: id },
      })

      const paymentDto: CreatePaymentResponseDto = await this.paymentService.assignValues(
        id,
        applicationId,
        callback.status === 'isPaid' ? true : false,
        payment,
      )
      return await this.paymentModel.create(paymentDto)
    }

    const paymentDto: Pick<
      BasePayment,
      | 'application_id'
      | 'fulfilled'
      | 'reference_id'
      | 'user4'
      | 'definition'
      | 'amount'
      | 'expires_at'
    > = {
      application_id: paymentDetails.application_id || applicationId,
      fulfilled: callback.status === 'paid' ? true : false,
      reference_id: callback.receptionID,
      user4: paymentDetails.user4 || '',
      definition: callback.chargeItemSubject,
      amount: paymentDetails.amount || 0,
      expires_at: new Date(),
    }
    return await this.paymentModel.create(paymentDto)
  }

  @Scopes(ApplicationScope.read)
  @Get('applications/:application_id/payment-status')
  @ApiParam({
    name: 'application_id',
    type: String,
    required: true,
    description: 'The id of the application check if it is paid.',
  })
  async getPaymentStatus(
    @Param('application_id') applicationId: string,
  ): Promise<PaymentStatusResponseDto> {
    const payment = await this.paymentService.findPaymentByApplicationId(
      applicationId,
    )

    return {
      fulfilled: payment.fulfilled,
    }
  }
}

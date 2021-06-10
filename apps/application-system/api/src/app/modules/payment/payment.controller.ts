import {
  Body,
  Controller,
  Param,
  Post,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common'

import {
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
  ApiHeader,
} from '@nestjs/swagger'
import {
  PaymentType as BasePayment,
} from '@island.is/application/core'
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
      reference_id: '55cf8d89-3ffa-4254-b3c3-71dd02dd834c',
      user4: "",
      definition: "",
      amount: 0,
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
}

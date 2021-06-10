import {
  Body,
  Controller,
  Param,
  Post,
  ParseUUIDPipe,
  BadRequestException,
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

import { PaymentService } from './payment.service'
import { CreatePaymentDto } from './dto/createPayment.dto'
import { CreatePaymentResponseDto } from './dto/createPaymentResponse.dto'
import { ApplicationSerializer } from '../application/tools/application.serializer'

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
    private readonly paymentService: PaymentService,
    private readonly auditService: AuditService,
  ) {}
  @Scopes(ApplicationScope.write)
  @ApiParam({
    name: 'applicationId',
    type: String,
    required: true,
    description: 'The id of the application to submit payment for.',
    allowEmptyValue: false,
  })
  @Post('applications/:applicationId/payment')
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
    // @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CreatePaymentResponseDto> {
    console.log('controller what up')
    // FIGURE SOME CHECK FOR LEGIT PAYMENT
    // if (existingApplication === null) {
    //   throw new BadRequestException(
    //     `No application found for application id: ${applicationId}`,
    //   )
    // }

    // TODO: verify template is ready from https://github.com/island-is/island.is/pull/3297

    // TODO: initial state should be required --------- IS INITIAL STATE REQUIRED FOR PAYMENT?

    const paymentDto: Pick<
      BasePayment,
      | 'applicationId'
      | 'fulfilled'
      | 'referenceId'
      | 'user4'
      | 'definition'
      | 'amount'
      | 'expiresAt'
      > = {
      applicationId: '55cf8d89-3ffa-4254-b3c3-71dd02dd834c',
      fulfilled: false,
      referenceId: "456",
      user4: "789",
      definition: "000",
      amount: 1,
      expiresAt: paymentDetails.expiresAt,
    }
    console.log('payment controller')
    console.log(JSON.stringify(paymentDto, null, 4));
    const createdPayment = await this.paymentService.createPaymentModel(
      paymentDto
    )

    this.auditService.audit({
      user,
      action: 'create',
      resources: createdPayment.id,
      meta: { applicationId: paymentDetails.applicationId },
    })
    return createdPayment
  }
}

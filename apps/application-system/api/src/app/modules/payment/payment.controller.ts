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
import { ApplicationAccessService } from '../application/tools/applicationAccess.service'

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
    private readonly applicationAccessService: ApplicationAccessService,
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
    application: CreatePaymentDto,
    @CurrentUser()
    user: User,
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<CreatePaymentResponseDto> {
    const { applicationId } = application
    const existingApplication = await this.applicationAccessService.findOneByIdAndNationalId(
      applicationId,
      user.nationalId,
    )

    if (existingApplication === null) {
      throw new BadRequestException(
        `No application found for application id: ${applicationId}`,
      )
    }

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
      applicationId: application.applicationId,
      fulfilled: false,
      referenceId: "",
      user4: "",
      definition: "",
      amount: application.amount,
      expiresAt: application.expiresAt,
    }

    const createdPayment = await this.paymentService.createPayment(
      paymentDto,
    )

    this.auditService.audit({
      user,
      action: 'create',
      resources: createdPayment.id,
      meta: { applicationId: application.applicationId },
    })
    return createdPayment
  }
}

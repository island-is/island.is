import {
  Controller,
  Param,
  Post,
  UseGuards,
  Get,
  ParseUUIDPipe,
  Body,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common'

import {
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
  ApiHeader,
  ApiOkResponse,
} from '@nestjs/swagger'
import { PaymentType as BasePayment } from '@island.is/application/types'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  Scopes,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { ApplicationScope } from '@island.is/auth/scopes'
import { AuditService } from '@island.is/nest/audit'
import { CreatePaymentResponseDto } from './dto'
import { InjectModel } from '@nestjs/sequelize'
import { Payment } from './payment.model'
import { PaymentService } from './payment.service'
import { PaymentStatusResponseDto } from './dto/paymentStatusResponse.dto'
import { CreateChargeInput } from './dto/createChargeInput.dto'
import { PaymentAPI } from '@island.is/clients/payment'
import { ApplicationService } from '@island.is/application/api/core'
import { getSlugFromType } from '@island.is/application/core'
import { environment } from '../../../environments'

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
    private readonly applicationService: ApplicationService,
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
    @CurrentUser() user: User,
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

    const application = await this.applicationService.findOneById(applicationId)

    let applicationSlug
    if (application?.typeId) {
      applicationSlug = getSlugFromType(application.typeId)
    } else {
      throw new NotFoundException(
        `application type id was not found for application id ${applicationId}`,
      )
    }

    const callbackUrl = `${environment.templateApi.clientLocationOrigin}/${applicationSlug}/${application.id}?done`

    return {
      // TODO: maybe treat the case where no payment was found differently?
      // not sure how/if that case would/could come up.
      fulfilled: payment.fulfilled || false,
      paymentUrl: this.paymentService.makeDelegationPaymentUrl(
        payment.user4,
        user.sub,
        callbackUrl,
      ),
    }
  }
}

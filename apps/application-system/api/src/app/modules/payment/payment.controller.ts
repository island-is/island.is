import {
  Body,
  Controller,
  Param,
  Post,
  UseGuards,
  Get,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common'

import {
  ApiCreatedResponse,
  ApiParam,
  ApiTags,
  ApiHeader,
  ApiOkResponse,
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
import { AuditService } from '@island.is/nest/audit'
import { CreatePaymentResponseDto } from './dto'
import { InjectModel } from '@nestjs/sequelize'
import { Payment } from './payment.model'
import type { Callback } from '@island.is/api/domains/payment'
import { PaymentService } from './payment.service'
import { PaymentStatusResponseDto } from './dto/paymentStatusResponse.dto'
import { isUuid } from 'uuidv4'
import { CreateChargeInput } from './dto/createChargeInput.dto'
import { PaymentAPI } from '@island.is/clients/payment'
import { FindItemType } from './utils/findItemType'

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
  ) //private applicationModel: typeof ApplicationModel,
  {}
  @Scopes(ApplicationScope.write)
  @Post('applications/:application_id/payment')
  @ApiCreatedResponse({ type: CreatePaymentResponseDto })
  async createCharge(
    @CurrentUser() user: User,
    @Param('application_id', new ParseUUIDPipe()) applicationId: string,
    @Body() payload: CreateChargeInput,
  ): Promise<CreatePaymentResponseDto> {
    if (!isUuid(applicationId)) {
      throw new BadRequestException(`ApplicationId is on wrong format.`)
    }
    const DISTRICT_COMMISSIONER_OF_REYKJAVIK = '6509142520'
    const inputApplicationType = FindItemType(payload.chargeItemCode)

    // Could use map/switch function/statement here to compare applications typeids - chargeItemCOde.
    const thisApplication = await this.paymentService
      .findApplicationById(applicationId, user.nationalId, inputApplicationType)
      .catch((error) => {
        throw new BadRequestException(
          `Unable to find application with the ID ${applicationId} ` + error,
        )
      })

    if (thisApplication.typeId.toString() !== inputApplicationType) {
      throw new BadRequestException(
        new Error(
          'Mismatch between create charge input and application payment.',
        ),
      )
    }

    // Could always use getCatalog, slice is a cheaper operation than getting all catalogs, always.
    const allCatalogs =
      payload.chargeItemCode.slice(0, 2) === 'AY'
        ? await this.paymentAPI.getCatalogByPerformingOrg(
            DISTRICT_COMMISSIONER_OF_REYKJAVIK,
          )
        : await this.paymentAPI.getCatalog()

    // Sort through all catalogs to find the correct one.
    const catalog = await this.paymentService
      .searchCorrectCatalog(
        payload.chargeItemCode,
        JSON.stringify(allCatalogs.item),
      )
      .catch((error) => {
        throw new BadRequestException(
          'Catalog request failed or bad input ' + error,
        )
      })

    const paymentDto: Pick<
      BasePayment,
      'application_id' | 'fulfilled' | 'amount' | 'definition' | 'expires_at'
    > = {
      application_id: applicationId,
      fulfilled: false,
      amount: catalog.priceAmount,
      definition: {
        chargeItemName: catalog.chargeItemName,
        chargeItemCode: catalog.chargeItemCode,
        performingOrganiationID: catalog.performingOrgID,
        chargeType: catalog.chargeType,
        amount: catalog.priceAmount,
      } as any,
      expires_at: new Date(),
    }

    const payment = await this.paymentModel.create(paymentDto)

    const chargeResult = await this.paymentService.createCharge(payment, user)

    this.auditService.audit({
      user,
      action: 'create',
      resources: paymentDto.application_id as string,
      meta: { applicationId: paymentDto.application_id, id: payment.id },
    })

    return {
      id: payment.id,
      paymentUrl: chargeResult.paymentUrl,
    }
  }

  @Scopes(ApplicationScope.write)
  @Post('applications/:application_id/payment/:id')
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
    @Param('application_id') applicationId: string,
    @Body() callback: Callback,
    @Param('id') id: string,
  ): Promise<void> {
    if (!isUuid(applicationId) || !isUuid(id)) {
      throw new BadRequestException(
        `ApplicationId or paymentId is on wrong format.`,
      )
    }
    if (callback.status !== 'paid') {
      // TODO: no-op.. it would be nice eventually to update all statuses
      return
    }

    await this.paymentModel.update(
      {
        fulfilled: true,
      },
      {
        where: {
          id,
          application_id: applicationId,
        },
      },
    )
  }

  @Scopes(ApplicationScope.read)
  @Get('applications/:application_id/payment-status')
  @ApiOkResponse({ type: PaymentStatusResponseDto })
  @ApiParam({
    name: 'application_id',
    type: String,
    required: true,
    description: 'The id of the application check if it is paid.',
  })
  async getPaymentStatus(
    @Param('application_id') applicationId: string,
  ): Promise<PaymentStatusResponseDto> {
    if (!isUuid(applicationId)) {
      throw new BadRequestException(`ApplicationId is on wrong format.`)
    }
    const payment = await this.paymentService.findPaymentByApplicationId(
      applicationId,
    )

    return {
      // TODO: maybe treat the case where no payment was found differently?
      // not sure how/if that case would/could come up.
      fulfilled: payment?.fulfilled || false,
    }
  }
}

import {
  Controller,
  Param,
  Post,
  UseGuards,
  Get,
  ParseUUIDPipe,
  BadRequestException,
  Body,
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
import { PaymentService } from './payment.service'
import { PaymentStatusResponseDto } from './dto/paymentStatusResponse.dto'
import { isUuid } from 'uuidv4'
import { CreateChargeInput } from './dto/createChargeInput.dto'
import { PaymentAPI } from '@island.is/clients/payment'
import { findItemType } from './utils/findItemType'

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
    if (!isUuid(applicationId)) {
      throw new BadRequestException(`ApplicationId is on wrong format.`)
    }
    const DISTRICT_COMMISSIONER_OF_REYKJAVIK = '6509142520'
    const inputApplicationType = findItemType(payload.chargeItemCode)
    //const inputApplicationType = 'DrivingLicence'

    console.log('application id: ' + applicationId)
    console.log('user national id: ' + user.nationalId)
    console.log('application type: ' + inputApplicationType)

    // Finding application to confirm correct catalog & price
    const thisApplication = await this.paymentService
      .findApplicationById(applicationId, user.nationalId, inputApplicationType)
      .catch((error) => {
        throw new BadRequestException(
          `Unable to find application with the ID ${applicationId} ` + error,
        )
      })

    console.log(thisApplication)
    console.log(thisApplication.typeId.toString())
    if (thisApplication.typeId.toString() !== inputApplicationType) {
      console.log('THROWING ERROR')
      throw new BadRequestException(
        new Error(
          'Mismatch between create charge input and application payment.',
        ),
      )
    }

    const allCatalogs =
      payload.chargeItemCode.slice(0, 2) === 'AY'
        ? await this.paymentAPI.getCatalogByPerformingOrg(
            DISTRICT_COMMISSIONER_OF_REYKJAVIK,
          )
        : await this.paymentAPI.getCatalog()

    console.log(allCatalogs)
    console.log(payload)

    // Sort through all catalogs to find the correct one.
    const catalog = await this.paymentService
      .searchCorrectCatalog(payload.chargeItemCode, allCatalogs.item)
      .catch((error) => {
        throw new BadRequestException(
          'Catalog request failed or bad input ' + error,
        )
      })

    console.log(catalog)

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
      },
      expires_at: new Date(),
    }
    console.log({ paymentDto })

    const payment = await this.paymentModel.create(paymentDto)

    console.log({ payment })

    const chargeResult = await this.paymentService.createCharge(payment, user)

    console.log({ chargeResult })

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
    @Param('applicationId') applicationId: string,
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

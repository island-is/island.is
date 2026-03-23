import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { ApplicationScope } from '@island.is/auth/scopes'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import {
  CreateChargeRequestDto,
  CreateChargeResponseDto,
  PaymentStatusResponseDto,
} from './dto'
import { PaymentService } from './payment.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('payments')
@ApiBearerAuth()
@ApiHeader({
  name: 'locale',
  description: 'Front-end language selected',
})
@Controller()
@CodeOwner(CodeOwners.Advania)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Scopes(ApplicationScope.read)
  @Get('form/:applicationId/payment-status')
  @ApiOkResponse({ type: PaymentStatusResponseDto })
  @ApiParam({
    name: 'applicationId',
    type: String,
    required: true,
    description: 'The ID of the application to get payment status for',
  })
  async getPaymentStatus(
    @Param('applicationId', new ParseUUIDPipe()) applicationId: string,
  ): Promise<PaymentStatusResponseDto> {
    return await this.paymentService.getStatus(applicationId)
  }

  @Scopes(ApplicationScope.write)
  @Post('form/:applicationId/create-payment')
  @ApiOkResponse({ type: CreateChargeResponseDto })
  async createPayment(
    @Param('applicationId', new ParseUUIDPipe()) applicationId: string,
    @Body() body: CreateChargeRequestDto,
    @CurrentUser() user: User,
  ): Promise<CreateChargeResponseDto> {
    return this.paymentService.createCharge(
      user,
      body.performingOrganizationID,
      body.chargeItems,
      applicationId,
      undefined,
      body.locale,
      body.payerNationalId,
    )
  }
}

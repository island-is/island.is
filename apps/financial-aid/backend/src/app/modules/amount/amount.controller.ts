import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common'

import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { apiBasePath, Staff } from '@island.is/financial-aid/shared/lib'
import { IdsUserGuard } from '@island.is/auth-nest-tools'

import { AmountService } from './amount.service'
import { AmountModel } from './models'
import { CreateAmountDto } from './dto'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { CurrentStaff } from '../../decorators'

@UseGuards(IdsUserGuard)
@Controller(`${apiBasePath}/amount`)
@ApiTags('amount')
export class AmountController {
  constructor(
    private readonly amountService: AmountService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Post('')
  @ApiCreatedResponse({
    description: 'Creates a new amount',
  })
  create(
    @CurrentStaff() staff: Staff,
    @Body() input: CreateAmountDto,
  ): Promise<AmountModel> {
    return this.amountService.create(input, staff)
  }
}

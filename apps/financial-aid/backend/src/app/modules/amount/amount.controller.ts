import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common'

import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import { apiBasePath } from '@island.is/financial-aid/shared/lib'
import { IdsUserGuard } from '@island.is/auth-nest-tools'

import { AmountService } from './amount.service'
import { AmountModel } from './models'
import { CreateAmountDto } from './dto'
import { LOGGER_PROVIDER } from '@island.is/logging'

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
  create(@Body() input: CreateAmountDto): Promise<AmountModel> {
    return this.amountService.create(input)
  }
}

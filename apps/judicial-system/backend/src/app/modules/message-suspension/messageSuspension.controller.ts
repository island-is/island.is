import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseEnumPipe,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CurrentHttpUser,
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import { MessageSuspensionCategory } from '@island.is/judicial-system/message'
import { type User } from '@island.is/judicial-system/types'

import { adminRule } from '../../guards'
import { MessageSuspension } from '../repository'
import { UpdateMessageSuspensionDto } from './dto/updateMessageSuspension.dto'
import { messageSuspensionManagerRule } from './guards/rolesRules'
import { MessageSuspensionService } from './messageSuspension.service'

@Controller('api/message-suspension')
@ApiTags('message suspensions')
@UseGuards(JwtAuthUserGuard, RolesGuard)
export class MessageSuspensionController {
  constructor(
    private readonly messageSuspensionService: MessageSuspensionService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @RolesRules(adminRule, messageSuspensionManagerRule)
  @Get()
  @ApiOkResponse({
    type: MessageSuspension,
    isArray: true,
    description: 'Gets the suspension state of all message categories',
  })
  getAll(): Promise<MessageSuspension[]> {
    this.logger.debug('Getting all message suspensions')

    return this.messageSuspensionService.getAll()
  }

  @RolesRules(adminRule, messageSuspensionManagerRule)
  @Patch(':category')
  @ApiOkResponse({
    type: MessageSuspension,
    description: 'Updates the suspension state of a message category',
  })
  update(
    @Param('category', new ParseEnumPipe(MessageSuspensionCategory))
    category: MessageSuspensionCategory,
    @CurrentHttpUser() user: User,
    @Body() update: UpdateMessageSuspensionDto,
  ): Promise<MessageSuspension> {
    this.logger.debug(`Updating message suspension ${category}`)

    return this.messageSuspensionService.update(
      category,
      update,
      user.nationalId,
    )
  }
}

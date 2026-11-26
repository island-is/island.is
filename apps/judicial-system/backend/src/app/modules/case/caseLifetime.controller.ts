import { Sequelize } from 'sequelize-typescript'

import {
  Body,
  Controller,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common'
import { InjectConnection } from '@nestjs/sequelize'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  JwtAuthUserGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'

import { adminRule } from '../../guards'
import { ExtendCaseLifetimeDto } from './dto/extendCaseLifetime.dto'
import { CaseLifetimeResponse } from './models/caseLifetime.response'
import { CaseLifetimeService } from './caseLifetime.service'

// Deliberately without the case guards: they only find live cases, and this
// route exists for the ones that are archived. Super admins have no access to
// case content, and get none here - the response says what happened, no more.
@Controller('api/case/:caseId/lifetime')
@ApiTags('cases')
@UseGuards(JwtAuthUserGuard, RolesGuard)
export class CaseLifetimeController {
  constructor(
    private readonly caseLifetimeService: CaseLifetimeService,
    @InjectConnection() private readonly sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @RolesRules(adminRule)
  @Patch()
  @ApiOkResponse({
    type: CaseLifetimeResponse,
    description:
      'Extends the lifetime of a request case, restoring it if it is archived',
  })
  extend(
    @Param('caseId', new ParseUUIDPipe()) caseId: string,
    @Body() extension: ExtendCaseLifetimeDto,
  ): Promise<CaseLifetimeResponse> {
    this.logger.debug(
      `Extending the lifetime of case ${caseId} by ${extension.days} days`,
    )

    return this.sequelize.transaction((transaction) =>
      this.caseLifetimeService.extend(caseId, extension.days, transaction),
    )
  }
}

import { Controller, Get, Inject, Logger, UseGuards } from '@nestjs/common'

import { LOGGER_PROVIDER } from '@island.is/logging'

import { JwtInjectBearerAuthGuard } from '@island.is/judicial-system/auth'

import { DefenderService } from './defender.service'

@UseGuards(JwtInjectBearerAuthGuard)
@Controller('api/defender')
export class DefenderController {
  constructor(
    private readonly defenderService: DefenderService,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Get('lawyerRegistry')
  async getDefendersFromRegistry() {
    this.logger.debug(`Getting defenders from registry`)

    return this.defenderService.getLawyers()
  }
}

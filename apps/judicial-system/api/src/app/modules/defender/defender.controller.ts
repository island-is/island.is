import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common'

import { ConfigType } from '@nestjs/config'
import { defenderModuleConfig } from './defender.config'
import { DefenderService } from './defender.service'
import { JwtInjectBearerAuthGuard } from '@island.is/judicial-system/auth'

@UseGuards(JwtInjectBearerAuthGuard)
@Controller('api/defender')
export class DefenderController {
  constructor(
    private readonly defenderService: DefenderService,
    @Inject(defenderModuleConfig.KEY)
    private readonly config: ConfigType<typeof defenderModuleConfig>,
  ) {}

  @Get('lawyerRegistry')
  async getDefendersFromRegistry() {
    return this.defenderService.getLawyers()
  }

  @Get('lawyerRegistry/:nationalId')
  async getDefenderFromRegistry(@Param('nationalId') nationalId: string) {
    return this.defenderService.getLawyer(nationalId)
  }
}

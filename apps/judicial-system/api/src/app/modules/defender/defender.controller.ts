import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common'

import { JwtInjectBearerAuthGuard } from '@island.is/judicial-system/auth'

import { DefenderService } from './defender.service'

@UseGuards(JwtInjectBearerAuthGuard)
@Controller('api/defender')
export class DefenderController {
  constructor(private readonly defenderService: DefenderService) {}

  @Get('lawyerRegistry')
  async getDefendersFromRegistry() {
    return this.defenderService.getLawyers()
  }

  @Get('lawyerRegistry/:nationalId')
  async getDefenderFromRegistry(@Param('nationalId') nationalId: string) {
    return this.defenderService.getLawyer(nationalId)
  }
}

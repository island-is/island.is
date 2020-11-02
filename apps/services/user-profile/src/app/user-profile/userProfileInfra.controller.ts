import { InfraController } from '@island.is/infra-nest-server'
import { BadRequestException, Controller, Get } from '@nestjs/common'
import { ApiOkResponse } from '@nestjs/swagger'
import { Readiness } from './dto/readinessDto'
import dns from 'dns'
import { SequelizeConfigService } from '../sequelizeConfig.service'

@Controller()
export class UserProfileInfraController extends InfraController {
  constructor(private sequelizeConfigService: SequelizeConfigService) {
    super()
  }

  @Get('readiness')
  @ApiOkResponse({ type: Readiness })
  async readiness(): Promise<Readiness> {
    const config = this.sequelizeConfigService.getSequelizeConfig()
    const url = config.host
    const result = await new Promise<boolean>((resolve, reject) => {
      dns.lookup(url, (err) => {
        if (err) reject(false)
        resolve(true)
      })
    })
    if (!result) throw new BadRequestException()
    return { ok: result }
  }
}

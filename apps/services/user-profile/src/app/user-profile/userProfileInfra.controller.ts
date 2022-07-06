import { InfraController } from '@island.is/infra-nest-server'
import {
  InternalServerErrorException,
  BadRequestException,
  Controller,
  Get,
} from '@nestjs/common'
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
    const { host } = this.sequelizeConfigService.createSequelizeOptions()
    if (!host) throw new InternalServerErrorException()
    const result = await new Promise<boolean>((resolve, reject) => {
      dns.lookup(host, (err) => {
        if (err) reject(false)
        resolve(true)
      })
    })
    if (!result) throw new BadRequestException()
    return { ok: result }
  }
}

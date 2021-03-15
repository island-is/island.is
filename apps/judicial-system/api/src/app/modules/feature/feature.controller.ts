import { Controller, Get, Param, UseGuards } from '@nestjs/common'

import { JwtInjectBearerAuthGuard } from '@island.is/judicial-system/auth'

import { environment } from '../../../environments'

const hiddenFeatures = environment.hiddenFeatures?.split(',')

@UseGuards(JwtInjectBearerAuthGuard)
@Controller('api/feature')
export class FeatureController {
  @Get(':name')
  async getFeature(@Param('name') name: string) {
    return !hiddenFeatures.includes(name)
  }
}

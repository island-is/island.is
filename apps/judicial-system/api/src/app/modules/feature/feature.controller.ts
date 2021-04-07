import { Controller, Get, Param, UseGuards } from '@nestjs/common'

import { JwtInjectBearerAuthGuard } from '@island.is/judicial-system/auth'
import { Feature } from '@island.is/judicial-system/types'

import { environment } from '../../../environments'

const hiddenFeatures = environment.features?.hidden?.split(',')

@UseGuards(JwtInjectBearerAuthGuard)
@Controller('api/feature')
export class FeatureController {
  @Get(':name')
  async getFeature(@Param('name') name: Feature) {
    return !hiddenFeatures?.includes(name)
  }
}

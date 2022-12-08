import { Controller, Get, Param } from '@nestjs/common'

import type { Feature } from '@island.is/judicial-system/types'
import { splitStringByComma } from '@island.is/judicial-system/formatters'

import { environment } from '../../../environments'

const hiddenFeatures = splitStringByComma(environment.features?.hidden)

// This controller is not guearded as it should also be available to users not logged in
@Controller('api/feature')
export class FeatureController {
  @Get(':name')
  async getFeature(@Param('name') name: Feature) {
    return !hiddenFeatures?.includes(name)
  }
}

import { Controller, Get, Inject, Param } from '@nestjs/common'

import type { ConfigType } from '@island.is/nest/config'

import type { Feature } from '@island.is/judicial-system/types'

import { featureModuleConfig } from './feature.config'

// This controller is not guearded as it should also be available to users not logged in
@Controller('api/feature')
export class FeatureController {
  constructor(
    @Inject(featureModuleConfig.KEY)
    private readonly config: ConfigType<typeof featureModuleConfig>,
  ) {}

  @Get(':name')
  async getFeature(@Param('name') name: Feature) {
    return !this.config.hiddenFeatures?.includes(name)
  }
}

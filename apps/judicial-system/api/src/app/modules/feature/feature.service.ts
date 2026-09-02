import { Inject, Injectable } from '@nestjs/common'

import type { ConfigType } from '@island.is/nest/config'

import type { Feature } from '@island.is/judicial-system/types'

import { featureModuleConfig } from './feature.config'

@Injectable()
export class FeatureService {
  constructor(
    @Inject(featureModuleConfig.KEY)
    private readonly config: ConfigType<typeof featureModuleConfig>,
  ) {}

  // Mirrors what the feature controller tells the web, so a write path can be
  // closed by the same HIDDEN_FEATURES value that hides its UI.
  isHidden(feature: Feature): boolean {
    return this.config.hiddenFeatures?.includes(feature) ?? false
  }
}

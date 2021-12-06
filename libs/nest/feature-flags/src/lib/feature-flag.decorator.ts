import { SetMetadata } from '@nestjs/common'
import { Features } from '@island.is/feature-flags'

export const FEATURE_FLAG_KEY = 'featureFlag'

export const FeatureFlag = (featureFlag: Features) =>
  SetMetadata(FEATURE_FLAG_KEY, featureFlag)

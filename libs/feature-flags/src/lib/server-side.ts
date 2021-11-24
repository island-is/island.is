import { ServerSideFeature } from './types'
import { FeatureNames as ServerSideFeatureNames } from '../../../../infra/src/dsl/features'

export class ServerSideFeatures implements ServerSideFeature {
  input?: string
  processed = false
  featuresOn: ServerSideFeatureNames[] = []
  constructor(featuresOn?: string) {
    this.input = featuresOn
  }
  isOn(feature: ServerSideFeatureNames): boolean {
    if (!this.processed) {
      if (typeof this.input === 'undefined') {
        throw new Error('Server-side feature flags input is missing or corrupt')
      } else {
        this.featuresOn = this.input
          .split(',')
          .map((item) => item.trim() as ServerSideFeatureNames)
        this.processed = true
      }
    }
    return this.featuresOn.includes(feature)
  }
}

export class ServerSideFeaturesOnTheClientSide implements ServerSideFeature {
  isOn(feature: ServerSideFeatureNames): boolean {
    throw new Error(
      'Using server-side features in the browser is not supported',
    )
  }
}

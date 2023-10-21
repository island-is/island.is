import { ServerSideFeatureClientType } from './types'
import { ServerSideFeature } from './features'

export class ServerSideFeatures implements ServerSideFeatureClientType {
  input?: string
  processed = false
  featuresOn: ServerSideFeature[] = []

  constructor(featuresOn?: string) {
    const isDev = process.env.NODE_ENV !== 'production'
    this.input = isDev ? featuresOn ?? '' : featuresOn
  }

  isOn(feature: ServerSideFeature): boolean {
    if (!this.processed) {
      if (typeof this.input === 'undefined') {
        throw new Error('Server-side feature flags input is missing or corrupt')
      } else {
        this.featuresOn = this.input
          .split(',')
          .map((item) => item.trim() as ServerSideFeature)
        this.processed = true
      }
    }
    return this.featuresOn.includes(feature)
  }
}

export class ServerSideFeaturesOnTheClientSide
  implements ServerSideFeatureClientType
{
  isOn(_feature: ServerSideFeature): boolean {
    throw new Error(
      'Using server-side features in the browser is not supported',
    )
  }
}

import { ServerSideFlag } from './types'
import { FeatureNames as ServerSideFeatureNames } from '../../../../infra/src/dsl/features'

export class ServerSideFlags implements ServerSideFlag {
  input?: string
  processed = false
  flagsOn: ServerSideFeatureNames[] = []
  constructor(flagsOn?: string) {
    this.input = flagsOn
  }
  isOn(flag: ServerSideFeatureNames): boolean {
    if (!this.processed) {
      if (typeof this.input === 'undefined') {
        throw new Error('Server-side feature flags input is missing or corrupt')
      } else {
        this.flagsOn = this.input
          .split(',')
          .map((item) => item.trim() as ServerSideFeatureNames)
        this.processed = true
      }
    }
    return this.flagsOn.includes(flag)
  }
}

export class ServerSideFlagsOnTheClientSide implements ServerSideFlag {
  isOn(flag: ServerSideFeatureNames): boolean {
    throw new Error('Using server-side flags in the browser is not supported')
  }
}

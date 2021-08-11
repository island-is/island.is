import { ServerSideFlag } from './types'
import { FeatureToggles as ServerSideFeatureToggles } from '../../../../infra/src/dsl/features'

export class ServerSideFlags implements ServerSideFlag {
  input: string
  processed: boolean = false
  flagsOn: ServerSideFeatureToggles[]
  constructor(flagsOn: string) {
    this.input = flagsOn
  }
  isOn(flag: ServerSideFeatureToggles): boolean {
    if (!this.processed) {
      if (typeof this.input === 'undefined') {
        throw new Error('')
      } else {
        this.flagsOn = this.input
          .split(',')
          .map((item) => item.trim() as ServerSideFeatureToggles)
        this.processed = true
      }
    }
    return this.flagsOn.includes(flag)
  }
}

export class ServerSideFlagsOnTheClientSide implements ServerSideFlag {
  isOn(flag: ServerSideFeatureToggles): boolean {
    throw new Error('Using server-side flags in the browser is not supported')
  }
}

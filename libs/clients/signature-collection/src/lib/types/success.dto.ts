import { EinstaklingurMaKjosaInfo } from '../../../gen/fetch'
import { ReasonKey, Requirement } from '../signature-collection.types'

export interface Success {
  success: boolean
  reasons?: string[]
}

export const mapReasons = (reasons: EinstaklingurMaKjosaInfo): string[] => {
  return Object.entries(reasons)
    .filter(([, value]) => !value)
    .map(([key]) => {
      switch (key) {
        case Requirement.medAldur:
          return ReasonKey.UnderAge
        case Requirement.medIsRikisfang:
          return ReasonKey.NoCitizenship
        case Requirement.byrAIsl:
          return ReasonKey.NotCurrentISResidency
        case Requirement.bjoAIslNylega:
          return ReasonKey.NotRecentISResidency
        case Requirement.bjoAIslUmsokn:
          return ReasonKey.NotISResidency
        default:
          return ReasonKey.DeniedByService
      }
    })
}

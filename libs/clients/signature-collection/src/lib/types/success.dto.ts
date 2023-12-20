import { ReasonKey, Requirement } from '../signature-collection.types'

export interface Success {
  success: boolean
  reasons?: ReasonKey[]
}

export const mapReasons = (
  reasons: Record<string, boolean | string>,
): ReasonKey[] => {
  return Object.entries(reasons)
    .filter(([, value]) => !value)
    .map(([key]) => {
      switch (key) {
        case Requirement.aldur:
          return ReasonKey.UnderAge
        case Requirement.rikisfang:
          return ReasonKey.NoCitizenship
        case Requirement.buseta:
          return ReasonKey.NotISResidency
        case Requirement.active:
          return ReasonKey.CollectionNotOpen
        case Requirement.notOwner:
          return ReasonKey.AlreadyOwner
        case Requirement.notSigned:
          return ReasonKey.AlreadySigned
        default:
          console.log('DEFAULT REASON', key)
          return ReasonKey.DeniedByService
      }
    })
}

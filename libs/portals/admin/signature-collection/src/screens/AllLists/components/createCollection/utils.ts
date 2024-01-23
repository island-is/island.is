import { createCollectionErrorMessages } from '../../../../lib/messages'

export const enum ReasonKey {
  UnderAge = 'underAge',
  NoCitizenship = 'noCitizenship',
  NotInArea = 'notInArea',
  NotISResidency = 'notISResidency',
  DeniedByService = 'deniedByService',
  CollectionNotOpen = 'collectionNotOpen',
  NoListToRemove = 'noListToRemove',
  SignatureNotFound = 'signatureNotFound',
  AlreadyOwner = 'alreadyOwner',
  AlreadySigned = 'alreadySigned',
  NotOwner = 'notOwner',
}

export const setReason = (res: string) => {
  switch (res) {
    case ReasonKey.UnderAge:
      return createCollectionErrorMessages.age
    case ReasonKey.NoCitizenship:
      return createCollectionErrorMessages.citizenship
    case ReasonKey.NotISResidency:
      return createCollectionErrorMessages.residency
    case ReasonKey.CollectionNotOpen:
      return createCollectionErrorMessages.active
    case ReasonKey.AlreadyOwner:
      return createCollectionErrorMessages.owner
    default:
      return createCollectionErrorMessages.deniedByService
  }
}

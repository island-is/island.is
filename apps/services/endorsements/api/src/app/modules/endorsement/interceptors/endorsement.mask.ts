import { Endorsement } from '../models/endorsement.model'

export function maskEndorsement(
  endorsement: Endorsement,
  isListOwner: boolean,
): Endorsement {
  // endorsement data display rules
  // always mask out nationalId for all
  endorsement.endorser = 'xxxxxx-xxxx'
  if (!isListOwner) {
    // only owner sees locality
    endorsement.meta.locality = ''
    // public and admins see name if endorser sets it to be shown
    if (!endorsement.meta.showName) {
      endorsement.meta.fullName = ''
    }
  }

  return endorsement
}

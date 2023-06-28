import { Endorsement } from '../models/endorsement.model'

export function maskEndorsement(
  endorsement: Endorsement,
  isListOwner: boolean,
  isAdmin: boolean,
): Endorsement {
  // endorsement data display rules
  // always mask out nationalId for all user groups

  if (isListOwner) {
    endorsement.endorser = 'xxxxxx-xxxx'
  } else if (isAdmin) {
    endorsement.endorser = 'xxxxxx-xxxx'
  } else {
    endorsement.endorser = 'xxxxxx-xxxx'
    endorsement.meta.locality = ''
    if (!endorsement.meta.showName) {
      endorsement.meta.fullName = ''
    }
  }
  return endorsement
}

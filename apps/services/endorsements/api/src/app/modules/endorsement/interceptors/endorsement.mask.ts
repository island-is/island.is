import { Endorsement } from '../models/endorsement.model'

export function maskEndorsement(
  endorsement: Endorsement,
  isListOwner: boolean,
): Endorsement {
  // always mask out nationalId
  endorsement.endorser = 'xxxxxx-xxxx'
  // endorsement data display rules for everyone(public,users,admins) except owner who sees all
  if (!isListOwner) {
    if (!endorsement.meta.showName) {
      endorsement.meta.fullName = ''
      endorsement.meta.locality = ''
    }
  }

  return endorsement
}

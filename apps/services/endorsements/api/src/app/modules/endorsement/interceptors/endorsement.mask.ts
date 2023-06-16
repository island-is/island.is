import { Endorsement } from '../models/endorsement.model'

export function maskEndorsement(
  endorsement: Endorsement,
  isListOwner: boolean,
): Endorsement {
  // always mask out nationalId and locality
  endorsement.endorser = 'xxxxxx-xxxx'
  endorsement.meta.locality = ''
  // endorsement data display rules for everyone(public,users,admins) except owner who sees all
  if (!isListOwner) {
    if (!endorsement.meta.showName) {
      endorsement.meta.fullName = ''
      
    }
  }

  return endorsement
}

import { Endorsement } from '../models/endorsement.model'

export function maskEndorsement(endorsement: Endorsement): Endorsement {
  // endorsement.endorser = 'xxxxxx-xxxx'
  // if(!endorsement.meta.showName) {
  //   endorsement.meta.fullName = 'XXX'
  //   endorsement.meta.locality = 'XXX'
  // }
  return endorsement
}


import { Endorsement } from '../models/endorsement.model'

export function maskEndorsement(endorsement: Endorsement): Endorsement {
    endorsement.endorser = 'xxxxxx-xxxx'
    return endorsement
}
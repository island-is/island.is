import { UserBase } from './user.dto'
import { FrambodDTO } from '../../../gen/fetch'
import { logger } from '@island.is/logging'

export interface Candidate extends UserBase {
  id: string
  phone: string
  email: string
  collectionId: string
  partyBallotLetter: string
  areaId?: string
  ownerName: string
  ownerBirthDate: Date | null
  hasActiveLists: boolean
}

export const mapCandidate = (
  candidate: FrambodDTO,
  areaId?: string,
): Candidate => {
  const { id: id, kennitala: nationalId } = candidate
  if (!id || !nationalId) {
    logger.warn(
      'Received partial collection information from the national registry.',
      candidate,
    )
    throw new Error('Candidate is missing id or nationalId')
  }
  return {
    id: id.toString(),
    nationalId,
    name: candidate.nafn ?? '',
    phone: candidate.simi ?? '',
    email: candidate.netfang ?? '',
    collectionId: candidate.medmaelasofnunID?.toString() ?? '',
    partyBallotLetter: candidate.listabokstafur ?? '',
    areaId,
    ownerName: candidate.abyrgdaradili?.nafn ?? '',
    ownerBirthDate: candidate.abyrgdaradili?.faedingardagur ?? null,
    hasActiveLists: candidate.opnirListar ?? false,
  }
}

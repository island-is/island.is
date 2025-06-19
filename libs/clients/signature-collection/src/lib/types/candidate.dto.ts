import { UserBase } from './user.dto'
import { FrambodBaseDTO } from '../../../gen/fetch'
import { logger } from '@island.is/logging'

export interface Candidate extends UserBase {
  id: string
  phone: string
  email: string
  collectionId: string
  partyBallotLetter: string
  areaId?: string
}

export const mapCandidate = (
  candidate: FrambodBaseDTO,
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
  }
}

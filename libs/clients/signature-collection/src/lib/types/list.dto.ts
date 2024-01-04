import { Area } from './area.dto'
import { UserBase } from './user.dto'
import { MedmaelalistiDTO } from '../../../gen/fetch'
import { Candidate, mapCandidate } from './candidate.dto'
import { logger } from '@island.is/logging'

export interface List {
  id: string
  title: string
  candidate: Candidate
  area: Area
  active: boolean
  startTime: Date
  endTime: Date
  collectionId: string
  collectors?: UserBase[]
  numberOfSignatures: number
  link: string
}

export function getLink(id: number): string {
  // TODO: create hash function
  return `https://island.is/umsoknir/maela-med-lista/?q=${id}`
}

export function mapList(list: MedmaelalistiDTO): List {
  const { id: id, medmaelasofnun: collection, frambod: candidate } = list
  if (!id || !collection || !candidate || !candidate.id) {
    logger.warn(
      'Received partial collection information from the national registry.',
      candidate,
    )
    throw new Error('Candidate is missing id or nationalId')
  }
  return {
    id: list.id?.toString() ?? '',
    collectionId: list.medmaelasofnun?.id?.toString() ?? '',
    title: list.listiNafn ?? '',
    startTime: list.medmaelasofnun?.sofnunStart ?? new Date(),
    endTime: list.medmaelasofnun?.sofnunEnd ?? new Date(),
    area: {
      id: list.svaedi?.id?.toString() ?? '',
      name: list.svaedi?.nafn?.toString() ?? '',
      min: list.svaedi?.fjoldi ?? 0,
    },
    candidate: mapCandidate(candidate),
    // TODO: update active functionality
    active: true,
    numberOfSignatures: list.fjoldiMedmaela ?? 0,
    link: getLink(candidate.id),
  }
}

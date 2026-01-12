import {
  FrambodInfoDTO,
  MedmaelalistiExtendedDTO,
  SvaediExtendedDTO,
} from '../../../gen/fetch'

export interface SummaryReport {
  id: string
  name: string
  min: number
  max: number
  lists: ListSummary[]
}

export interface ListSummary {
  candidateName: string
  listName: string
  partyBallotLetter: string
  nrOfSignatures: number
  nrOfDigitalSignatures: number
  nrOfPaperSignatures: number
  areaName: string
}

export const mapListSummary = (list: MedmaelalistiExtendedDTO): ListSummary => {
  return {
    candidateName: list.frambodNafn ?? '',
    listName: list.listiNafn ?? '',
    partyBallotLetter: list.frambod?.listabokstafur || '',
    nrOfSignatures: list.fjoldiMedmaela || 0,
    nrOfDigitalSignatures: list.fjoldiMedmaelaRafraen || 0,
    nrOfPaperSignatures: list.fjoldiMedmaelaSkrifleg || 0,
    areaName: list.svaedi?.nafn || '',
  }
}

export const mapAreaSummaryReport = (
  svaedi: SvaediExtendedDTO,
): SummaryReport => {
  return {
    id: svaedi.id?.toString() || '',
    name: svaedi.nafn ?? '',
    min: svaedi.fjoldi || 0,
    max: svaedi.fjoldiMax || 0,
    lists: svaedi.medmaelalistar?.map(mapListSummary) || [],
  }
}

export const mapCandidateSummaryReport = (
  candidate: FrambodInfoDTO,
): SummaryReport => {
  return {
    id: candidate.id?.toString() || '',
    name: candidate.nafn ?? '',
    min: 0,
    max: 0,
    lists: candidate.medmaelalistar?.map(mapListSummary) || [],
  }
}

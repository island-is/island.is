import { MedmaelalistiExtendedDTO, SvaediExtendedDTO } from '../../../gen/fetch'

export interface AreaSummaryReport {
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
}

export const mapListSummary = (list: MedmaelalistiExtendedDTO): ListSummary => {
  return {
    candidateName: list.frambodNafn ?? '',
    listName: list.listiNafn ?? '',
    partyBallotLetter: list.frambod?.listabokstafur || '',
    nrOfSignatures: list.fjoldiMedmaela || 0,
    nrOfDigitalSignatures: list.fjoldiMedmaelaRafraen || 0,
    nrOfPaperSignatures: list.fjoldiMedmaelaSkrifleg || 0,
  }
}

export const mapAreaSummaryReport = (
  svaedi: SvaediExtendedDTO,
): AreaSummaryReport => {
  return {
    id: svaedi.id?.toString() || '',
    name: svaedi.nafn ?? '',
    min: svaedi.fjoldi || 0,
    max: svaedi.fjoldiMax || 0,
    lists: svaedi.medmaelalistar?.map(mapListSummary) || [],
  }
}

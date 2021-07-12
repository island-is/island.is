import { ISODate, LawChapterSlug, MinistrySlug, RegName, RegulationType } from '@hugsmidjan/regulations-editor/types'
import { Kennitala } from '@island.is/regulations'
import { DraftingStatus, DraftRegulationCancel, DraftRegulationChange } from '@island.is/regulations/admin'

export type DraftRegulation = {
  id: string
  drafting_status: DraftingStatus
  name?: RegName
  title: string
  text: string
  authors: Kennitala[]
  ministry: MinistrySlug
  law_chapters: LawChapterSlug[]
  changes?: DraftRegulationChange[]
  cancel?: DraftRegulationCancel
  drafting_notes?: string
  ideal_publish_date?: ISODate
  signature_date?: ISODate
  effective_date?: ISODate
  type?: RegulationType
}

export type DraftRegulations = Array<Omit<DraftRegulation, 'changes' | 'cancel'>>




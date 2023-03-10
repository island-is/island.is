export type CreateDraftRegulationBody = {
  type?: string
}

export type AppendixInput = {
  text?: string
  title?: string
}

export type EditDraftBody = {
  appendixes?: AppendixInput[]
  comments?: string
  draftingNotes?: string
  draftingStatus?: string
  effectiveDate?: string
  fastTrack?: boolean
  idealPublishDate?: string
  lawChapters?: string[]
  ministry?: string
  name?: string
  signatureDate?: string
  signatureText?: string
  signedDocumentUrl?: string
  text?: string
  title?: string
  type?: string
}

export type CreateDraftRegulationCancelInput = {
  changingId: string
  date?: string
  regulation: string
}

export type DraftRegulationCancelModel = {
  date?: string
  dropped?: boolean
  id?: string
  name?: string
  regTitle?: string
  type: string
}

export type UpdateDraftRegulationCancelInput = {
  id: string
  date?: string
}

export type DeleteDraftRegulationCancelInput = {
  id: string
}

export type CreateChangeAppendixInput = {
  text?: string
  title?: string
}

export type CreateDraftRegulationChangeInput = {
  appendixes?: CreateChangeAppendixInput[]
  changingId: string
  comments?: string
  date?: string
  diff?: string
  regulation: string
  text?: string
  title?: string
}

export type ChangeAppendix = {
  text?: string
  title?: string
}

export type DraftRegulationChangeModel = {
  appendixes?: ChangeAppendix[]
  comments?: string
  date?: string
  diff?: string
  dropped?: boolean
  id?: string
  name?: string
  regTitle?: string
  text?: string
  title?: string
  type?: string
}

export type UpdateChangeAppendixInput = {
  text?: string
  title?: string
}

export type UpdateDraftRegulationChangeInput = {
  appendixes?: UpdateChangeAppendixInput[]
  comments?: string
  date?: string
  diff?: string
  id: string
  text?: string
  title?: string
}

export type DeleteDraftRegulationChangeInput = {
  id: string
}

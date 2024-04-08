export interface PaperMail {
  kennitala: string
  wantsPaper: boolean
  dateAdded?: string
  dateUpdated?: string
  origin: string
}

export interface PaperMailResponse {
  paperMail: PaperMail[]
  totalCount: number
}

export interface PaperMailInput {
  pageSize?: number
  page?: number
}

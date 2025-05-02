import { Entry } from 'contentful-management'

export interface CmsGrant {
  entry: Entry
  id: string
  referenceId: string
  grantId: string
  dateFrom?: string
  dateTo?: string
}

export type CmsGrantInput = Array<{
  referenceId: string
  cmsGrantEntry: Entry
  inputFields: CmsGrantInputFields
}>

export type CmsGrantInputFields = Array<{ key: string; value: unknown }>

export type GrantUpdateResult =
  | {
      ok: 'success'
      entry: Entry
    }
  | {
      ok: 'error'
      error?: string
    }
  | {
      ok: 'somewhat'
      error?: string
    }

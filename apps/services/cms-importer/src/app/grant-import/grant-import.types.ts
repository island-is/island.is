import { Entry } from 'contentful-management'

export interface CmsGrant {
  entry: Entry
  id: string
  referenceId: string
  grantId: string
  dateFrom?: string
  dateTo?: string
}

import { Entry } from 'contentful-management'

export interface CmsGrant {
  entry: Entry
  id: string
  applicationId: string
  dateFrom?: string
  dateTo?: string
  isOpen?: boolean
}

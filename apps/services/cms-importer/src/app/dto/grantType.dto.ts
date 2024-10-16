import { GrantDto } from '@island.is/clients/grants'

export interface GrantType {
  id: string
  applicationId: string
  dateTo?: string
  dateFrom?: string
}

export const mapGrantType = (data: GrantDto): GrantType => {
  return {
    id: data.id,
    applicationId: data.applicationId,
    dateTo: data.dateTo,
    dateFrom: data.dateFrom,
  }
}

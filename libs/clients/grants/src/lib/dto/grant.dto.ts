export interface GrantDto {
  //grant ID - guid
  id: string
  //guid
  applicationId: string
  name: string
  category: string
  dateFrom?: string
  dateTo?: string
  isAvailable?: boolean
  fundUrl?: string
}

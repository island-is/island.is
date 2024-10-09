export interface GrantDto {
  //grant ID - guid
  id: string
  //guid
  fundId: string
  name: string
  category: string
  dateFrom?: string
  dateTo?: string
  isAvailable?: boolean
  url?: string
}

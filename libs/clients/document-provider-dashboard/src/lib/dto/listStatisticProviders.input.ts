export type ListStatisticProvidersInputDto = {
  nationalId: string
  from?: Date
  to?: Date
  sortBy?: 'Date' | 'Category' | 'Type' | 'Sender' | 'Subject' | 'Publication'
  desc?: boolean
  page?: number
  pageSize?: number
}

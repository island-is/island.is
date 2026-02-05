export interface OverviewFilters {
  suppliers?: Array<Filter>
  customers?: Array<Filter>
  invoiceTypes?: Array<Filter>
}

interface Filter {
  name: string
  value: string
}

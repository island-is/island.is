export interface OverviewFilters {
  suppliers?: Array<Filter>
  customers?: Array<Filter>
  invoicePaymentTypes?: Array<Filter>
}

interface Filter {
  name: string
  value: string
}

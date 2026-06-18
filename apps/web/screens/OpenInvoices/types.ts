export interface OverviewFilters {
  suppliers?: Array<Filter>
  debtors?: Array<Filter>
  invoicePaymentTypes?: Array<Filter>
  ministries?: Array<Filter>
}

interface Filter {
  name: string
  value: string
}

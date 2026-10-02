import { registerEnumType } from '@nestjs/graphql'
import {
  OpenInvoiceSortFields,
  SortDirections,
} from '@island.is/clients/government-invoices'

registerEnumType(OpenInvoiceSortFields, {
  name: 'IcelandicGovernmentInstitutionsOpenInvoiceSortField',
})
registerEnumType(SortDirections, {
  name: 'IcelandicGovernmentInstitutionsSortDirection',
})

export { OpenInvoiceSortFields, SortDirections }

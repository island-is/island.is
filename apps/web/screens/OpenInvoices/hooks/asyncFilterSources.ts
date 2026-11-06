import { IntlShape } from 'react-intl'
import { format as formatKennitala } from 'kennitala'

import {
  IcelandicGovernmentInstitutionsDebtor,
  IcelandicGovernmentInstitutionsDebtors,
  IcelandicGovernmentInstitutionsMinistries,
  IcelandicGovernmentInstitutionsMinistry,
  IcelandicGovernmentInstitutionsSupplier,
  IcelandicGovernmentInstitutionsSuppliers,
} from '@island.is/web/graphql/schema'

import { m } from '../messages'

/**
 * Per-filter `extractResult`/`mapItem` pairs for `useAsyncFilterSource` —
 * how to read each filter's own paginated+lookup GraphQL query result.
 */

export const extractMinistries = (data: {
  icelandicGovernmentInstitutionsMinistries: IcelandicGovernmentInstitutionsMinistries
}) => data.icelandicGovernmentInstitutionsMinistries

export const mapMinistry = (
  ministry: IcelandicGovernmentInstitutionsMinistry,
) => ({
  value: ministry.id,
  label: ministry.name,
})

export const extractSuppliers = (data: {
  icelandicGovernmentInstitutionsSuppliers: IcelandicGovernmentInstitutionsSuppliers
}) => data.icelandicGovernmentInstitutionsSuppliers

export const mapSupplier = (
  supplier: IcelandicGovernmentInstitutionsSupplier,
  formatMessage: IntlShape['formatMessage'],
) => ({
  value: supplier.id,
  label: supplier.name,
  tooltip: formatMessage(m.overview.supplierIdTooltip, {
    kennitala: formatKennitala(supplier.id),
  }),
})

export const extractDebtors = (data: {
  icelandicGovernmentInstitutionsDebtors: IcelandicGovernmentInstitutionsDebtors
}) => data.icelandicGovernmentInstitutionsDebtors

export const mapDebtor = (debtor: IcelandicGovernmentInstitutionsDebtor) => ({
  value: debtor.id,
  label: debtor.name,
})

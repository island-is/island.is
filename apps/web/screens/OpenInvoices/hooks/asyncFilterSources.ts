import {
  IcelandicGovernmentInstitutionsDebtor,
  IcelandicGovernmentInstitutionsDebtors,
  IcelandicGovernmentInstitutionsInvoicePaymentType,
  IcelandicGovernmentInstitutionsInvoicePaymentTypes,
  IcelandicGovernmentInstitutionsMinistries,
  IcelandicGovernmentInstitutionsMinistry,
  IcelandicGovernmentInstitutionsSupplier,
  IcelandicGovernmentInstitutionsSuppliers,
} from '@island.is/web/graphql/schema'

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
) => ({
  value: supplier.id,
  label: supplier.name,
})

export const extractDebtors = (data: {
  icelandicGovernmentInstitutionsDebtors: IcelandicGovernmentInstitutionsDebtors
}) => data.icelandicGovernmentInstitutionsDebtors

export const mapDebtor = (debtor: IcelandicGovernmentInstitutionsDebtor) => ({
  value: debtor.id,
  label: debtor.name,
})

export const extractInvoicePaymentTypes = (data: {
  icelandicGovernmentInstitutionsInvoicePaymentTypes: IcelandicGovernmentInstitutionsInvoicePaymentTypes
}) => data.icelandicGovernmentInstitutionsInvoicePaymentTypes

export const mapInvoicePaymentType = (
  invoicePaymentType: IcelandicGovernmentInstitutionsInvoicePaymentType,
) => ({
  value: invoicePaymentType.id,
  label: invoicePaymentType.name,
})
